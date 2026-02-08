// services/index.ts
import { UserService } from "./user-service";
import { HistoryService } from "./history-service";
import { GalleryService } from "./gallery-service";
import { BookingService } from "./booking-service";
import { ForumService } from "./forum-service";
import { ContactService } from "./contact-service";
import { SessionService } from "./session-service";
import { PostLikeService } from "./post_like-service";

// Individual service instances
export const userService = new UserService();
export const historyService = new HistoryService();
export const galleryService = new GalleryService();
export const bookingService = new BookingService();
export const forumService = new ForumService();
export const contactService = new ContactService();
export const sessionService = new SessionService();
export const postLikeService = new PostLikeService();

// Export individual class services for direct access
export {
  UserService,
  HistoryService,
  GalleryService,
  BookingService,
  ForumService,
  ContactService,
  SessionService,
};

// Export types for better type safety
export type {
  User,
  HistoryContent,
  GalleryItem,
  Booking,
  Post,
  Comment,
  ContactMessage,
} from "../../config/database/schema/schema-types";
