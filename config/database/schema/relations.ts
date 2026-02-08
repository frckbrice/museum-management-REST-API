// Updated schema with improvements

import { relations } from "drizzle-orm";
import {
  bookings,
  comments,
  groupMembers,
  groups,
  historyContent,
  postLikes,
  posts,
  users,
} from "./tables";
// import schemas from "./tables";

// const { bookings, comments, groupMembers, groups, historyContent, postLikes, posts, users } = schemas;

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  bookings: many(bookings),
}));

export const historyContentRelations = relations(historyContent, ({ one }) => ({
  author: one(users, {
    fields: [historyContent.authorId],
    references: [users.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(postLikes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [groups.createdById],
    references: [users.id],
  }),
  members: many(groupMembers),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

// Schema relation default export
export default {
  usersRelations,
  historyContentRelations,
  bookingsRelations,
  postsRelations,
  commentsRelations,
  postLikesRelations,
  groupsRelations,
  groupMembersRelations,
};
