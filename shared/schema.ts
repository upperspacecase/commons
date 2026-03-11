import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for custom auth (email/password + Google OAuth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  username: varchar("username").notNull().unique(), // @username for finding friends
  password: varchar("password"), // hashed password for email/password auth (null for Google)
  googleId: varchar("google_id").unique(), // Google OAuth ID (null for email/password)
  authProvider: varchar("auth_provider").notNull().default("email"), // "email" or "google"
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  status: text("status").notNull().default("available"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
});
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;

export const borrowRequests = pgTable("borrow_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id),
  borrowerId: varchar("borrower_id").notNull().references(() => users.id),
  message: text("message"),
  requestedDate: timestamp("requested_date"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBorrowRequestSchema = createInsertSchema(borrowRequests).omit({
  id: true,
  createdAt: true,
});
export type InsertBorrowRequest = z.infer<typeof insertBorrowRequestSchema>;
export type BorrowRequest = typeof borrowRequests.$inferSelect;
