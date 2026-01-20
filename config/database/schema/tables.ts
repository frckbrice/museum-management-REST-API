// Updated schema with improvements
import {
    pgTable,
    text,
    boolean,
    timestamp,
    uuid,
    unique
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { bookingStatus, userStatus } from "./enum";


// Reusable email schema
const emailSchema = z.string().email("Must provide a valid email");

// Users table
export const users = pgTable("users", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    email: text("email").notNull().unique(),
    fullName: text("full_name").notNull(),
    userType: userStatus("role").notNull().default("visitor"),
    profileImage: text("profile_image"),
    bio: text("bio"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});


// History content table
export const historyContent = pgTable("history_content", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(),
    metaDescription: text("meta_description").notNull(),
    keywords: text("keywords").notNull(),
    imageUrl: text("image_url"),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null", onUpdate: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});


// Gallery items table
export const galleryItems = pgTable("gallery_items", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    altText: text("alt_text"),
    category: text("category").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});


// Bookings table
export const bookings = pgTable("bookings", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    fullName: text("full_name"),
    email: text("email"),
    phone: text("phone"),
    visitDate: timestamp("visit_date", { mode: "string", withTimezone: true }).notNull(),
    groupSize: text("group_size").notNull(),
    tourType: text("tour_type").notNull(),
    specialRequests: text("special_requests"),
    status: bookingStatus("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});


// Posts table
export const posts = pgTable("posts", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(),
    isAttendantOnly: boolean("is_attendant_only").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});


// Comments table
export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});


// Post likes table
export const postLikes = pgTable("post_likes", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    uniquePostUser: unique().on(table.postId, table.userId),
}));


// Groups table
export const groups = pgTable("groups", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    slug: text("slug").notNull().unique(),
    isAttendantOnly: boolean("is_attendant_only").default(false),
    createdById: uuid("created_by_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});


// Group members table
export const groupMembers = pgTable("group_members", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    groupId: uuid("group_id").references(() => groups.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    uniqueGroupUser: unique().on(table.groupId, table.userId),
}));


// Contact messages
export const contactMessages = pgTable("contact_messages", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});




// Schema
export default {
    users,
    historyContent,
    galleryItems,
    bookings,
    posts,
    comments,
    postLikes,
    groups,
    groupMembers,
    contactMessages,
};

// export type DatabaseSchema = typeof schema;
