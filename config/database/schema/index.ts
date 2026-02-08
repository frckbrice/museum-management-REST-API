// Export all tables and relations
import * as schema from "./tables";
import * as relations from "./relations";
import * as enums from "./enum";
import * as schemaTypes from "./schema-types";

// Apply relations
// Create the complete schema object
// const schema = {
//     users: {
//         ...dbSchema.users,
//         relations: relations.usersRelations,
//     },
//     historyContent: {
//         ...dbSchema.historyContent,
//         relations: relations.historyContentRelations,
//     },
//     bookings: {
//         ...dbSchema.bookings,
//         relations: relations.bookingsRelations,
//     },
//     posts: {
//         ...dbSchema.posts,
//         relations: relations.postsRelations,
//     },
//     comments: {
//         ...dbSchema.comments,
//         relations: relations.commentsRelations,
//     },
//     postLikes: {
//         ...dbSchema.postLikes,
//         relations: relations.postLikesRelations,
//     },
//     groups: {
//         ...dbSchema.groups,
//         relations: relations.groupsRelations,
//     },
//     groupMembers: {
//         ...dbSchema.groupMembers,
//         relations: relations.groupMembersRelations,
//     },
//     contactMessages: {
//         ...dbSchema.contactMessages,
//         relations: {},
//     },
//     galleryItems: {
//         ...dbSchema.galleryItems,
//         relations: {},
//     },
// };

export { schema, relations, enums, schemaTypes };
