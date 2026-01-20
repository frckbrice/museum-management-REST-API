import session from "express-session";
import {
  type User,
  type HistoryContent,
  type GalleryItem,
  type Booking,
  type Post,
  type Comment,
  type ContactMessage
} from "./schema/schema-types";


export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(userData: Partial<User>): Promise<User>;
  updateUser(id: string, userData: Partial<User>): Promise<User | null>;

  // History content operations
  getHistoryContentById(id: string): Promise<HistoryContent | null>;
  getHistoryContentBySlug(slug: string): Promise<HistoryContent | null>;
  getAllHistoryContent(): Promise<HistoryContent[] | {
    data: HistoryContent[];
    total: number;
    hasMore: boolean;
  }>;
  createHistoryContent(data: Partial<HistoryContent>): Promise<HistoryContent>;
  updateHistoryContent(id: string, data: Partial<HistoryContent>): Promise<HistoryContent | null>;

  // Gallery operations
  getGalleryItemById(id: string): Promise<GalleryItem | null>;
  getAllGalleryItems(): Promise<GalleryItem[] | {
    data: GalleryItem[];
    total: number;
    hasMore: boolean;
  }>;
  getGalleryItemsByCategory(category: string): Promise<GalleryItem[] | {
    data: GalleryItem[];
    total: number;
    hasMore: boolean;
  }>;
  createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem>;

  // Booking operations
  getBookingById(id: string): Promise<Booking | null>;
  getBookingsByUserId(userId: string): Promise<Booking[] | {
    data: Booking[];
    total: number;
    hasMore: boolean;
  }>;
  getAllBookings(status?: string): Promise<Booking[] | {
    data: Booking[];
    total: number;
    hasMore: boolean;
  }>;
  createBooking(data: Partial<Booking>): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | null>;

  // Forum operations
  getPostById(id: string): Promise<Post | null>;
  getAllPosts(isAttendantOnly?: boolean): Promise<Post[] | {
    data: Post[];
    total: number;
    hasMore: boolean;
  }>;
  createPost(data: Partial<Post>): Promise<Post>;
  getCommentsByPostId(postId: string): Promise<Comment[] | {
    data: Comment[];
    total: number;
    hasMore: boolean;
  }>;
  createComment(data: any): Promise<Comment>;

  // Contact message operations
  getAllContactMessages(): Promise<ContactMessage[] | {
    data: ContactMessage[];
    total: number;
    hasMore: boolean;
  }>;
  createContactMessage(data: Partial<ContactMessage>): Promise<ContactMessage>;
  markContactMessageAsRead(id: string): Promise<ContactMessage | null>;
  getUnreadContactMessagesCount(): Promise<number>;

  // Session store
  sessionStore: session.Store;
}
