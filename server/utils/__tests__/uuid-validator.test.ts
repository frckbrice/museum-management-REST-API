/**
 * Unit tests for server/utils/validations/uuid-validator.ts.
 * Covers UUIDValidator static methods and exported helpers: validateId, validateIds,
 * isValidUUID, isValidUUIDv4, normalizeUUID, isUUID, validateUUIDBatch.
 */
import {
  UUIDValidator,
  validateId,
  validateIds,
  isValidUUID,
  isValidUUIDv4,
  normalizeUUID,
  isUUID,
  validateUUIDBatch,
} from "../validations/uuid-validator";
import { ValidationError } from "../../../middlewares/errors/error-handler";

// UUID v4: version digit at index 14 must be "4"
const validV4 = "123e4567-e89b-42d3-a456-426614174000";
// UUID v1: version digit at index 14 must be "1" (e.g. 1xxx in third group)
const validV1 = "550e8400-e29b-11d4-a716-446655440000";
const nilUuid = "00000000-0000-0000-0000-000000000000";

describe("uuid-validator", () => {
  describe("UUIDValidator.isValidUUID", () => {
    it("returns true for valid UUID v4", () => {
      expect(UUIDValidator.isValidUUID(validV4)).toBe(true);
    });
    it("returns true for valid UUID v1", () => {
      expect(UUIDValidator.isValidUUID(validV1)).toBe(true);
    });
    it("returns false for empty or non-string", () => {
      expect(UUIDValidator.isValidUUID("")).toBe(false);
      expect(UUIDValidator.isValidUUID(null as unknown as string)).toBe(false);
      expect(UUIDValidator.isValidUUID(undefined as unknown as string)).toBe(false);
    });
    it("returns false for invalid format", () => {
      expect(UUIDValidator.isValidUUID("not-a-uuid")).toBe(false);
      expect(UUIDValidator.isValidUUID("123e4567-e89b-12d3-a456")).toBe(false);
    });
  });

  describe("UUIDValidator.isValidUUIDv4", () => {
    it("returns true for valid UUID v4", () => {
      expect(UUIDValidator.isValidUUIDv4(validV4)).toBe(true);
    });
    it("returns false for non-v4 UUID", () => {
      expect(UUIDValidator.isValidUUIDv4(validV1)).toBe(false);
    });
  });

  describe("UUIDValidator.validateAndNormalize / validateId", () => {
    it("returns normalized lowercase UUID for valid input", () => {
      expect(validateId(validV4, "id")).toBe(validV4.toLowerCase());
    });
    it("throws ValidationError for empty string", () => {
      expect(() => validateId("", "id")).toThrow(ValidationError);
    });
    it("throws ValidationError for invalid UUID", () => {
      expect(() => validateId("invalid", "id")).toThrow(ValidationError);
    });
    it("throws ValidationError for nil UUID", () => {
      expect(() => validateId(nilUuid, "id")).toThrow(ValidationError);
    });
  });

  describe("validateIds", () => {
    it("returns array of normalized UUIDs", () => {
      const ids = [validV4, validV1];
      expect(validateIds(ids, "ids")).toEqual(ids.map((id) => id.toLowerCase()));
    });
    it("throws for non-array", () => {
      expect(() => validateIds(null as unknown as string[], "ids")).toThrow(ValidationError);
    });
    it("throws for empty array", () => {
      expect(() => validateIds([], "ids")).toThrow(ValidationError);
    });
    it("throws for duplicate UUIDs", () => {
      expect(() => validateIds([validV4, validV4], "ids")).toThrow(ValidationError);
    });
  });

  describe("isValidUUID / isValidUUIDv4 (exported)", () => {
    it("isValidUUID matches UUIDValidator.isValidUUID", () => {
      expect(isValidUUID(validV4)).toBe(true);
      expect(isValidUUID("x")).toBe(false);
    });
    it("isValidUUIDv4 matches UUIDValidator.isValidUUIDv4", () => {
      expect(isValidUUIDv4(validV4)).toBe(true);
      expect(isValidUUIDv4(validV1)).toBe(false);
    });
  });

  describe("normalizeUUID", () => {
    it("returns normalized UUID or throws", () => {
      expect(normalizeUUID(validV4)).toBe(validV4.toLowerCase());
      expect(() => normalizeUUID("bad")).toThrow(ValidationError);
    });
  });

  describe("isUUID type guard", () => {
    it("returns true for valid UUID string", () => {
      expect(isUUID(validV4)).toBe(true);
    });
    it("returns false for non-string", () => {
      expect(isUUID(123)).toBe(false);
      expect(isUUID(null)).toBe(false);
    });
    it("returns false for invalid string", () => {
      expect(isUUID("not-uuid")).toBe(false);
    });
  });

  describe("validateUUIDBatch", () => {
    it("returns validated array of UUID strings", () => {
      const arr = [validV4, validV1];
      expect(validateUUIDBatch(arr)).toEqual(arr.map((id) => id.toLowerCase()));
    });
    it("throws for non-array", () => {
      expect(() => validateUUIDBatch(null as unknown as unknown[])).toThrow(ValidationError);
    });
    it("throws when an element is not a string", () => {
      expect(() => validateUUIDBatch([validV4, 123])).toThrow(ValidationError);
    });
  });

  describe("UUIDValidator.getVersion", () => {
    it("returns version number for valid UUID", () => {
      expect(UUIDValidator.getVersion(validV4)).toBe(4);
    });
    it("returns null for invalid UUID", () => {
      expect(UUIDValidator.getVersion("x")).toBeNull();
    });
  });

  describe("UUIDValidator.isNilUUID / isMaxUUID", () => {
    it("isNilUUID returns true only for nil UUID", () => {
      expect(UUIDValidator.isNilUUID(nilUuid)).toBe(true);
      expect(UUIDValidator.isNilUUID(validV4)).toBe(false);
    });
  });

  describe("UUIDValidator.equals", () => {
    it("returns true for same UUID in different case", () => {
      expect(UUIDValidator.equals(validV4, validV4.toUpperCase())).toBe(true);
    });
    it("returns false for different UUIDs", () => {
      expect(UUIDValidator.equals(validV4, validV1)).toBe(false);
    });
  });
});
