import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./customAuth";
import { createAuthRoutes } from "./authRoutes";
import { insertItemSchema, insertBorrowRequestSchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { pool } from "./db";

const PgSession = connectPgSimple(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "sessions",
      }),
      secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  // Initialize passport
  const passport = setupAuth(storage);
  app.use(passport.initialize());
  app.use(passport.session());

  // Auth routes
  app.use("/api/auth", createAuthRoutes(storage));


  // Items routes
  app.get('/api/items', isAuthenticated, async (req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.get('/api/items/:id', isAuthenticated, async (req, res) => {
    try {
      const item = await storage.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ message: "Failed to fetch item" });
    }
  });

  app.post('/api/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const itemData = insertItemSchema.parse({
        ...req.body,
        ownerId: userId,
      });
      const item = await storage.createItem(itemData);
      res.json(item);
    } catch (error: any) {
      console.error("Error creating item:", error);
      res.status(400).json({ message: error.message || "Failed to create item" });
    }
  });

  app.patch('/api/items/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const item = await storage.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      const userId = (req.user as any).id;
      if (item.ownerId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this item" });
      }

      const updatedItem = await storage.updateItemStatus(req.params.id, req.body.status);
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating item status:", error);
      res.status(500).json({ message: "Failed to update item status" });
    }
  });

  app.delete('/api/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const item = await storage.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      const userId = (req.user as any).id;
      if (item.ownerId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this item" });
      }

      await storage.deleteItem(req.params.id);
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Borrow requests routes
  app.get('/api/borrow-requests', isAuthenticated, async (req, res) => {
    try {
      const requests = await storage.getBorrowRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching borrow requests:", error);
      res.status(500).json({ message: "Failed to fetch borrow requests" });
    }
  });

  app.get('/api/borrow-requests/borrower/:borrowerId', isAuthenticated, async (req, res) => {
    try {
      const requests = await storage.getBorrowRequestsByBorrower(req.params.borrowerId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching borrower requests:", error);
      res.status(500).json({ message: "Failed to fetch borrower requests" });
    }
  });

  app.post('/api/borrow-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).id;
      const requestData = insertBorrowRequestSchema.parse({
        ...req.body,
        borrowerId: userId,
      });
      const request = await storage.createBorrowRequest(requestData);
      res.json(request);
    } catch (error: any) {
      console.error("Error creating borrow request:", error);
      res.status(400).json({ message: error.message || "Failed to create borrow request" });
    }
  });

  app.patch('/api/borrow-requests/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const updatedRequest = await storage.updateBorrowRequestStatus(req.params.id, req.body.status);
      if (!updatedRequest) {
        return res.status(404).json({ message: "Borrow request not found" });
      }
      res.json(updatedRequest);
    } catch (error) {
      console.error("Error updating borrow request status:", error);
      res.status(500).json({ message: "Failed to update borrow request status" });
    }
  });

  // Object storage routes - protected file serving
  app.get("/objects/:objectPath(*)", isAuthenticated, async (req: any, res) => {
    const userId = (req.user as any)?.id;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  app.put("/api/items/image", isAuthenticated, async (req: any, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }
    const userId = (req.user as any).id;
    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "public",
        },
      );
      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting item image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
