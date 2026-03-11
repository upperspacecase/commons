import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  type User, 
  type UpsertUser,
  type Item,
  type InsertItem,
  type BorrowRequest,
  type InsertBorrowRequest,
  users,
  items,
  borrowRequests
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, data: Partial<UpsertUser>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Items
  getItems(): Promise<Item[]>;
  getItemById(id: string): Promise<Item | undefined>;
  getItemsByOwner(ownerId: string): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItemStatus(id: string, status: string): Promise<Item | undefined>;
  deleteItem(id: string): Promise<void>;
  
  // Borrow Requests
  getBorrowRequests(): Promise<BorrowRequest[]>;
  getBorrowRequestsByItem(itemId: string): Promise<BorrowRequest[]>;
  getBorrowRequestsByBorrower(borrowerId: string): Promise<BorrowRequest[]>;
  createBorrowRequest(request: InsertBorrowRequest): Promise<BorrowRequest>;
  updateBorrowRequestStatus(id: string, status: string): Promise<BorrowRequest | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Items
  async getItems(): Promise<Item[]> {
    return await db.select().from(items);
  }

  async getItemById(id: string): Promise<Item | undefined> {
    const result = await db.select().from(items).where(eq(items.id, id));
    return result[0];
  }

  async getItemsByOwner(ownerId: string): Promise<Item[]> {
    return await db.select().from(items).where(eq(items.ownerId, ownerId));
  }

  async createItem(item: InsertItem): Promise<Item> {
    const result = await db.insert(items).values(item).returning();
    return result[0];
  }

  async updateItemStatus(id: string, status: string): Promise<Item | undefined> {
    const result = await db
      .update(items)
      .set({ status })
      .where(eq(items.id, id))
      .returning();
    return result[0];
  }

  async deleteItem(id: string): Promise<void> {
    await db.delete(items).where(eq(items.id, id));
  }

  // Borrow Requests
  async getBorrowRequests(): Promise<BorrowRequest[]> {
    return await db.select().from(borrowRequests);
  }

  async getBorrowRequestsByItem(itemId: string): Promise<BorrowRequest[]> {
    return await db.select().from(borrowRequests).where(eq(borrowRequests.itemId, itemId));
  }

  async getBorrowRequestsByBorrower(borrowerId: string): Promise<BorrowRequest[]> {
    return await db.select().from(borrowRequests).where(eq(borrowRequests.borrowerId, borrowerId));
  }

  async createBorrowRequest(request: InsertBorrowRequest): Promise<BorrowRequest> {
    const result = await db.insert(borrowRequests).values(request).returning();
    return result[0];
  }

  async updateBorrowRequestStatus(id: string, status: string): Promise<BorrowRequest | undefined> {
    const result = await db
      .update(borrowRequests)
      .set({ status })
      .where(eq(borrowRequests.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
