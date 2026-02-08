/**
 * Unit tests for server/services/contact-service.ts.
 * Covers getAllContactMessages, createContactMessage, markContactMessageAsRead,
 * getUnreadContactMessagesCount with mocked db and validators.
 */
import { ContactService } from "../contact-service";
import { NotFoundError, ValidationError } from "../../../middlewares/errors/error-handler";
import { eq } from "drizzle-orm";
import { contactMessages } from "../../../config/database/schema/tables";

jest.mock("../../utils/validations/uuid-validator");
jest.mock("../../utils/validations/email-validation", () => ({
  validateEmail: jest.fn(),
  sanitizeString: (str: string) => (str || "").trim().replace(/\s+/g, " "),
  slugify: (t: string) => t,
}));

describe("ContactService", () => {
  let contactService: ContactService;
  const mockDb = {
    query: {
      contactMessages: {
        findMany: jest.fn(),
      },
    },
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn(),
  };

  const mockBaseService = {
    withErrorHandling: jest.fn(async (fn: () => Promise<unknown>) => fn()),
    db: mockDb,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    contactService = new ContactService();
    Object.assign(contactService, mockBaseService);
  });

  describe("getAllContactMessages", () => {
    it("returns data, total, and hasMore", async () => {
      const mockData = [{ id: "1", message: "Hi" }];
      const mockTotal = [{ count: 1 }];
      mockDb.query.contactMessages.findMany.mockResolvedValue(mockData);
      mockDb.select.mockReturnValue({
        from: jest.fn().mockResolvedValue(mockTotal),
      });

      const result = await contactService.getAllContactMessages(10, 0);
      expect(result.data).toEqual(mockData);
      expect(result.total).toBe(1);
      expect(result.hasMore).toBe(false);
    });
  });

  describe("createContactMessage", () => {
    it("throws ValidationError when required fields are missing", async () => {
      await expect(contactService.createContactMessage({})).rejects.toThrow(ValidationError);
      await expect(
        contactService.createContactMessage({ fullName: "A", email: "a@b.com" } as any)
      ).rejects.toThrow(ValidationError);
    });

    it("throws when validateEmail throws", async () => {
      const validateEmail = require("../../utils/validations/email-validation").validateEmail;
      validateEmail.mockImplementation(() => {
        throw new ValidationError("Invalid email format");
      });
      await expect(
        contactService.createContactMessage({
          fullName: "A",
          email: "bad",
          message: "Hi",
          subject: "Sub",
        })
      ).rejects.toThrow(ValidationError);
    });

    it("inserts and returns message when valid", async () => {
      const validateEmail = require("../../utils/validations/email-validation").validateEmail;
      validateEmail.mockImplementation(() => { });
      const created = {
        id: "new-id",
        fullName: "Test",
        email: "test@example.com",
        message: "Hello",
        subject: "Sub",
        isRead: false,
        createdAt: new Date(),
      };
      mockDb.returning.mockResolvedValue([created]);

      const result = await contactService.createContactMessage({
        fullName: "Test",
        email: "test@example.com",
        message: "Hello",
        subject: "Sub",
      });
      expect(result).toEqual(created);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe("markContactMessageAsRead", () => {
    it("throws NotFoundError when no row updated", async () => {
      const validateId = require("../../utils/validations/uuid-validator").validateId;
      validateId.mockReturnValue("valid-id");
      mockDb.returning.mockResolvedValue([]);

      await expect(
        contactService.markContactMessageAsRead("123e4567-e89b-12d3-a456-426614174000")
      ).rejects.toThrow(NotFoundError);
    });

    it("returns updated message when found", async () => {
      const validateId = require("../../utils/validations/uuid-validator").validateId;
      validateId.mockReturnValue("valid-id");
      const updated = { id: "valid-id", isRead: true };
      mockDb.returning.mockResolvedValue([updated]);

      const result = await contactService.markContactMessageAsRead("valid-id");
      expect(result).toEqual(updated);
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith({ isRead: true });
      expect(mockDb.where).toHaveBeenCalledWith(eq(contactMessages.id, "valid-id"));
    });
  });

  describe("getUnreadContactMessagesCount", () => {
    it("returns count from db", async () => {
      mockDb.from = jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([{ count: 5 }]),
      });
      mockDb.select.mockReturnValue(mockDb);

      const result = await contactService.getUnreadContactMessagesCount();
      expect(result).toBe(5);
    });
  });
});
