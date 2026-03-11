import { Router } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { DatabaseStorage } from "./storage";

const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function createAuthRoutes(storage: DatabaseStorage) {
  const router = Router();

  // Get current user
  router.get("/user", (req, res) => {
    if (req.isAuthenticated() && req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Email/Password Signup
  router.post("/signup", async (req, res) => {
    try {
      const data = signupSchema.parse(req.body);

      // Check if email already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await storage.createUser({
        email: data.email,
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        authProvider: "email",
        googleId: null,
        profileImageUrl: null,
      });

      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after signup" });
        }
        res.json(user);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Email/Password Login
  router.post("/login", (req, res, next) => {
    try {
      const data = loginSchema.parse(req.body);

      passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string }) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
          return res.status(401).json({ message: info?.message || "Invalid credentials" });
        }

        req.login(user, (loginErr) => {
          if (loginErr) {
            return res.status(500).json({ message: "Error logging in" });
          }
          res.json(user);
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Google OAuth - Initiate
  router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
  }));

  // Google OAuth - Callback
  router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/landing" }),
    (req, res) => {
      // Successful authentication, redirect to home
      res.redirect("/");
    }
  );

  // Logout
  router.post("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  return router;
}
