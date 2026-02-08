// Updated schema with improvements

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import schemas from "./tables";

const {
  bookings,
  comments,
  groupMembers,
  groups,
  historyContent,
  postLikes,
  posts,
  users,
  galleryItems,
  contactMessages,
} = schemas;

// Schema validations (remain the same as your original)
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
  email: (schema) => schema.email("Must provide a valid email"),
  fullName: (schema) => schema.min(2, "Full name must be at least 2 characters"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHistoryContentSchema = createInsertSchema(historyContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings)
  .extend({
    email: z.string().email("Must provide a valid email"),
    phone: z.string().min(6, "Phone number must be at least 6 characters"),
  })
  .omit({
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  });

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages)
  .extend({
    email: z.string().email("Must provide a valid email"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  })
  .omit({
    id: true,
    isRead: true,
    createdAt: true,
  });

const postLikeSchema = createInsertSchema(postLikes).omit({
  id: true,
  createdAt: true,
});

export const insertPostLikeSchema = postLikeSchema.extend({
  postId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  isAttendantOnly: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({
  id: true,
  createdAt: true,
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type HistoryContent = typeof historyContent.$inferSelect;
export type InsertHistoryContent = z.infer<typeof insertHistoryContentSchema>;

export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type PostLike = typeof postLikes.$inferSelect;
export type InsertPostLike = z.infer<typeof insertPostLikeSchema>;

export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;

export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;

// Schema
export default {
  insertUserSchema,
  insertHistoryContentSchema,
  insertGalleryItemSchema,
  insertBookingSchema,
  insertPostSchema,
  insertCommentSchema,
  insertContactMessageSchema,
  insertPostLikeSchema,
  insertGroupSchema,
  insertGroupMemberSchema,
};
