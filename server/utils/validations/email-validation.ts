import { ValidationError } from "../../../middlewares/errors/error-handler";

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format");
  }
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ");
};

export function slugify(text: string): string {
  return text
    .toString() // Convert to string
    .toLowerCase() // Convert to lowercase
    .trim() // Trim whitespace
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}
