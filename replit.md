# Commons - Social Item Sharing Platform

## Overview

Commons is a private social network application that enables friends to share and borrow items within their trusted circle. The platform focuses on creating a warm, community-centered experience for lending and borrowing physical items (camping gear, tools, sports equipment, etc.) without involving strangers.

## Current Status (November 14, 2025)

### Completed Features
- ✅ Custom authentication system with username (@blah style)
- ✅ PostgreSQL database with Drizzle ORM
- ✅ User management with email/password authentication
- ✅ Username system for finding friends (unique, required field)
- ✅ Item CRUD operations (create, read, update, delete)
- ✅ Item status management (available/borrowed, owner-controlled)
- ✅ Object storage integration for item photos
- ✅ Protected routes and authorization
- ✅ Landing page with Honk-inspired design and pastel colors
- ✅ Login/Signup page with username input
- ✅ Home page with real item data, search, and category filters
- ✅ Add Item page with photo upload
- ✅ Profile page showing username and user's items with status toggle
- ✅ Responsive design with mobile bottom nav
- ✅ Honk-inspired design system with pastel colors and bold typography
- ✅ Working authentication redirect (login/signup → home page)
- ✅ Full application rebrand from "Modern" to "Commons"

### In Development
- User search functionality to find friends by username
- Activity page showing borrow history (optional)
- Friend connections/network (future feature)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Wouter for lightweight client-side routing
- TanStack React Query for server state management and caching

**UI Component System**
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Honk-inspired design system implementing:
  - Pastel color palette: light blue (#E3F2FD), green (#C8E6C9), pink (#F8BBD0), yellow (#FFF9C4), purple (#E1BEE7), teal (#B2DFDB)
  - Bold, large typography: DM Sans for headings (text-4xl to text-7xl), Inter for body text
  - Generous rounded corners (rounded-3xl) for friendly appearance
  - Clean white backgrounds with colorful accents
  - Full light/dark mode support with CSS custom properties
- Component architecture using class-variance-authority for variant management

**State Management Strategy**
- React Query handles all server state with:
  - Automatic background refetching disabled (`refetchOnWindowFocus: false`)
  - Infinite stale time for manual cache invalidation control
  - Custom query functions with 401 error handling
- Local UI state managed with React hooks
- Authentication state derived from `/api/auth/user` query

**Key Design Decisions**
- Mobile-first responsive design with bottom navigation on mobile, expanding to full navigation on desktop
- Visual-first item discovery through image-heavy card layouts
- Toast notifications for user feedback using Radix UI Toast primitives
- Theme switching capability for user preference (light/dark modes)
- Search integrated directly into home page (not separate page)

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- ES modules throughout the codebase
- Custom middleware for request/response logging with timing metrics
- Error handling middleware for consistent error responses

**Authentication & Session Management**
- Custom authentication with email/password and Google OAuth
- Passport.js with LocalStrategy and GoogleStrategy
- Session storage in PostgreSQL via connect-pg-simple
- 7-day session TTL with secure, HTTP-only cookies
- Protected routes using `isAuthenticated` middleware
- Password hashing with bcryptjs (10 salt rounds)
- Google OAuth account linking to existing email accounts

**Data Access Layer**
- Drizzle ORM for type-safe database queries
- Repository pattern implemented through `DatabaseStorage` class (IStorage interface)
- Neon serverless PostgreSQL with WebSocket support
- Schema-first design with Zod validation for insert operations

**Database Schema Design**
- **Users**: User profiles with authentication (id, email, password, username, firstName, lastName, profileImageUrl, googleId, authProvider)
- **Items**: Shareable items with owner relationship, category, status (available/borrowed), and image URL
- **Sessions**: Standard session storage for authentication

**Note**: Removed borrow requests table - simplified to owner-controlled status only

**API Endpoints**
All endpoints require authentication except auth routes:

*Authentication*
- `GET /api/auth/user` - Get current authenticated user
- `POST /api/auth/signup` - Create new account with email/password
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback handler
- `POST /api/auth/logout` - Logout and clear session

*Items*
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Create new item (owner set from authenticated user)
- `PATCH /api/items/:id/status` - Update item status (owner only)
- `DELETE /api/items/:id` - Delete item (owner only)

*Object Storage*
- `GET /objects/:objectPath(*)` - Serve protected objects with ACL check
- `POST /api/objects/upload` - Get presigned URL for file upload
- `PUT /api/items/image` - Set ACL policy for uploaded item image

**Object Storage**
- Google Cloud Storage integration for image uploads
- Custom ACL (Access Control List) system for object permissions
- Owner-based access control with public/private visibility
- Replit sidecar authentication for GCS credentials
- Presigned URL upload flow (client uploads directly to GCS)
- Public visibility for item images (accessible to all authenticated users)

### External Dependencies

**Authentication**
- **Custom Authentication**: Email/password (Google OAuth available in backend but hidden from UI)
  - Passport.js with LocalStrategy (and GoogleStrategy in backend)
  - Requires: `SESSION_SECRET` environment variable (Google keys available but not exposed in UI)
  - bcryptjs for password hashing
  - Sessions stored in PostgreSQL

**Database**
- **Neon Serverless PostgreSQL**: Primary data store
  - WebSocket connection support via `@neondatabase/serverless`
  - Connection pooling for scalability
  - Requires: `DATABASE_URL` environment variable
  - Drizzle ORM for queries and migrations

**Object Storage**
- **Google Cloud Storage**: Image and asset storage
  - External account authentication via Replit sidecar
  - Sidecar endpoint: `http://127.0.0.1:1106`
  - Custom ACL implementation for fine-grained permissions
  - Environment vars: `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PUBLIC_OBJECT_SEARCH_PATHS`, `PRIVATE_OBJECT_DIR`

**UI Component Libraries**
- **Radix UI**: Headless component primitives (dialogs, dropdowns, avatars, etc.)
- **Shadcn/ui**: Pre-styled component implementations
- **Lucide React**: Icon library for consistent iconography
- **Uppy**: File upload component with progress tracking and AWS S3 compatibility

**Development Tools**
- **Replit Vite Plugins**: Development tooling
  - Runtime error modal overlay
  - Cartographer for code navigation
  - Development banner

**Utility Libraries**
- **date-fns**: Date formatting and manipulation
- **zod**: Runtime schema validation
- **clsx & tailwind-merge**: Conditional className management
- **memoizee**: Function result caching (OIDC config)

**Build & Development**
- **esbuild**: Server-side code bundling for production
- **tsx**: TypeScript execution for development
- **Vite**: Frontend build tool and dev server

## Recent Changes (November 14, 2025)

### Latest Session
1. **Honk-Inspired Redesign**: Complete visual overhaul to match Honk's playful, colorful aesthetic
   - Updated design_guidelines.md with pastel color palette and bold typography guidelines
   - Modified index.css to implement new color system using pastel blues, greens, pinks, yellows, and purples
   - Redesigned landing page with 6 colorful feature cards using different pastel backgrounds
   - Updated typography to use very large, bold headings (text-6xl/7xl on landing, text-4xl/5xl on pages)
   - Increased border radius across the app (rounded-3xl for cards) for friendlier appearance

2. **Application Rebrand**: Renamed from "Modern" to "Commons" throughout entire application
   - Updated all page titles and branding text
   - Changed landing page headings and hero section
   - Modified auth page titles ("Join Commons" instead of "Join Modern")
   - Updated replit.md documentation to reflect new name
   - Ensured consistent "Commons" branding across all UI elements

3. **ProfilePage Bug Fixes**: Fixed critical rendering and session issues
   - Fixed React "setState during render" error by moving redirect logic to useEffect
   - Made page resilient to missing firstName/lastName data with fallbacks
   - Improved loading state handling to prevent premature redirects
   - Fixed race condition between React Query cache and component mounting
   - Added proper null checks and graceful degradation

## Previous Changes (October 19, 2025)

### Latest Session
1. **Username System Implementation**: Added username field to enable friend discovery
   - Added `username` field to users table (required, unique, searchable)
   - Updated signup flow to require username input
   - Display username on profile page (@username style)
   - Database migration completed successfully

2. **Add Item Page**: Created fully functional item creation flow
   - Built AddItemPage with form validation
   - Integrated object storage for photo uploads
   - Presigned URL flow: get upload URL → upload to GCS → set ACL
   - Categories: 10 options from Camping & Outdoors to Other
   - Successfully tested end-to-end

3. **Connected Home Page to Real Data**: Replaced mock data with API integration
   - Fetches items from `/api/items` endpoint
   - Real-time search and category filtering
   - Status filtering (All, Available, Borrowed, Yours)
   - Loading states with skeleton UI
   - Empty state handling
   - Successfully tested with multiple items

4. **Profile Page Implementation**: Built comprehensive profile management
   - Displays user's full name and @username
   - Shows all items owned by user
   - Toggle item status (available ↔ borrowed) with instant updates
   - Item count and statistics
   - Logout functionality
   - Successfully tested: view items, toggle status, logout

### Earlier Today
5. **Green Color Scheme**: Updated design from coral-peach/orange to friendly green
   - Primary: 145 65% 45% (friendly green for community)
   - Accent: 145 50% 96% (soft green highlights)
   - Clean neutral backgrounds (0 0% 98%) for clarity
   - Updated index.css and design_guidelines.md with new palette
   - Maintains full light/dark mode support

6. **Authentication Redirect Fix**: Fixed critical bug where users stayed on landing page after login/signup
   - Problem: `queryClient.invalidateQueries()` caused race condition with redirect
   - Solution: Use `queryClient.setQueryData(["/api/auth/user"], user)` to immediately update cache
   - Auth state now updates BEFORE redirect happens
   - Login/signup now properly redirect to home page
   - Tested end-to-end: signup → home page, logout, login → home page ✅

7. **Custom Authentication System**: Replaced Replit Auth with custom email/password authentication
   - Created passport.js strategy for local (email/password) authentication
   - Backend includes Google OAuth support (hidden from UI)
   - Implemented signup, login, and logout endpoints
   - Built AuthPage with toggle between login and signup modes
   - Added session management with PostgreSQL storage (7-day TTL)
   - Implemented password hashing with bcryptjs (10 salt rounds)
   - Updated all protected routes to use custom authentication middleware

8. **Database Schema Updates**: Updated users table to support custom authentication
   - Added password field (nullable, hashed with bcrypt)
   - Added googleId field for Google OAuth users
   - Added authProvider field ('email' | 'google')
   - Added username field (unique, required)
   - Fixed ID column defaults to use gen_random_uuid() for all tables
   - Removed borrow requests table (simplified MVP)

## Previous Changes (October 18, 2025)

1. **Search Integration**: Removed separate search page, integrated search bar directly into home page
2. **Bottom Navigation**: Removed search icon from bottom nav (now has 4 items instead of 5)
3. **Authentication Flow**: Implemented initial authentication system
4. **Database Schema**: Created users, items, borrowRequests, and sessions tables
5. **Object Storage**: Set up Google Cloud Storage with ACL system for item photos
6. **API Routes**: Implemented all CRUD operations for items and borrow requests
7. **Frontend Auth**: Added useAuth hook, auth utils, and conditional routing based on auth state

## Next Steps

1. Add user search functionality to find friends by username
   - Search endpoint: `GET /api/users/search?q=username`
   - Display search results with @username
   - Simple list view for adding friends (future)

2. Polish and refinements
   - Add item delete functionality
   - Add item edit functionality
   - Improve mobile responsiveness
   - Add image upload progress indicators

3. Future Features
   - Activity page showing item lending history
   - Friend connections/network
   - Real-time updates using websockets
   - Notifications for item availability
