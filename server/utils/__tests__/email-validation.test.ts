/**
 * Unit tests for server/utils/validations/email-validation.ts.
 * Covers validateEmail, sanitizeString, and slugify.
 */
import { validateEmail, sanitizeString, slugify } from "../validations/email-validation";
import { ValidationError } from "../../../middlewares/errors/error-handler";

describe("email-validation", () => {
  describe("validateEmail", () => {
    it("does not throw for valid email addresses", () => {
      expect(() => validateEmail("user@example.com")).not.toThrow();
      expect(() => validateEmail("a@b.co")).not.toThrow();
      expect(() => validateEmail("user+tag@domain.org")).not.toThrow();
    });

    it("throws ValidationError for invalid email format", () => {
      expect(() => validateEmail("invalid")).toThrow(ValidationError);
      expect(() => validateEmail("missing@")).toThrow(ValidationError);
      expect(() => validateEmail("@domain.com")).toThrow(ValidationError);
      expect(() => validateEmail("no-at-sign.com")).toThrow(ValidationError);
      expect(() => validateEmail("")).toThrow(ValidationError);
    });

    it("throws with message 'Invalid email format'", () => {
      try {
        validateEmail("bad");
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        expect((e as ValidationError).message).toBe("Invalid email format");
      }
    });
  });

  describe("sanitizeString", () => {
    it("trims leading and trailing whitespace", () => {
      expect(sanitizeString("  hello  ")).toBe("hello");
    });

    it("collapses multiple spaces to single space", () => {
      expect(sanitizeString("a   b   c")).toBe("a b c");
    });

    it("returns empty string for whitespace-only input", () => {
      expect(sanitizeString("   ")).toBe("");
    });
  });

  describe("slugify", () => {
    it("converts to lowercase", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("replaces spaces with hyphens", () => {
      expect(slugify("foo bar baz")).toBe("foo-bar-baz");
    });

    it("removes non-word characters except hyphens", () => {
      expect(slugify("Hello! World?")).toBe("hello-world");
    });

    it("replaces multiple hyphens with single hyphen", () => {
      expect(slugify("a---b")).toBe("a-b");
    });

    it("trims hyphens from start and end", () => {
      expect(slugify("-hello-")).toBe("hello");
    });

    it("handles string conversion for non-string input", () => {
      expect(slugify(123 as unknown as string)).toBe("123");
    });
  });
});
