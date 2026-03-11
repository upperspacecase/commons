import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import type { DatabaseStorage } from "./storage";
import type { User } from "../shared/schema";

export function setupAuth(storage: DatabaseStorage) {
  // Serialize user to session
  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as User).id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Local Strategy (Email & Password)
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          
          if (!user) {
            return done(null, false, { message: "Incorrect email or password." });
          }

          if (!user.password) {
            return done(null, false, { message: "Please use Google to sign in." });
          }

          const isValidPassword = await bcrypt.compare(password, user.password);
          
          if (!isValidPassword) {
            return done(null, false, { message: "Incorrect email or password." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          let user = await storage.getUserByGoogleId(profile.id);

          if (!user) {
            // Check if user exists with this email (from email/password signup)
            const emailUser = await storage.getUserByEmail(profile.emails?.[0]?.value || "");
            
            if (emailUser) {
              // Link Google account to existing email account
              user = await storage.updateUser(emailUser.id, {
                googleId: profile.id,
                authProvider: "google",
                profileImageUrl: profile.photos?.[0]?.value || emailUser.profileImageUrl,
              });
            } else {
              // Create new user from Google profile
              user = await storage.createUser({
                email: profile.emails?.[0]?.value || "",
                googleId: profile.id,
                authProvider: "google",
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
                profileImageUrl: profile.photos?.[0]?.value,
                password: null,
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  return passport;
}

// Middleware to check if user is authenticated
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
