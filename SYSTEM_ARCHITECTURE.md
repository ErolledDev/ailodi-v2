# System Architecture - AI Lodi CMS

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           END USERS                                 │
└─────────────────┬───────────────────────────────┬───────────────────┘
                  │                               │
                  ▼                               ▼
        ┌─────────────────────┐        ┌─────────────────────┐
        │   Public Blog Site  │        │  Admin Dashboard    │
        │  (Read-Only Pages)  │        │  (Protected)        │
        │                     │        │                     │
        │ - /blog             │        │ - /admin/login      │
        │ - /blog/[slug]      │        │ - /admin/dashboard  │
        │ - /                 │        │                     │
        └─────────┬───────────┘        └──────────┬──────────┘
                  │                               │
                  └───────────────┬───────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Next.js Application     │
                    │                           │
                    │ ┌─────────────────────┐   │
                    │ │   App Router        │   │
                    │ │ /app                │   │
                    │ │ /admin              │   │
                    │ │ /api                │   │
                    │ └─────────────────────┘   │
                    └────────────┬────────────┬─┘
                                 │            │
                ┌────────────────┘            └────────────────┐
                │                                               │
    ┌───────────▼──────────┐                    ┌──────────────▼────┐
    │   GitHub API         │                    │   Firebase        │
    │                      │                    │                   │
    │ ┌────────────────┐   │                    │ ┌────────────┐    │
    │ │ /posts folder  │   │                    │ │ Firestore  │    │
    │ │ .md files      │   │                    │ │            │    │
    │ │ (CMS)          │   │                    │ │ comments   │    │
    │ │                │   │                    │ │ subscribers│    │
    │ └────────────────┘   │                    │ └────────────┘    │
    │                      │                    │                   │
    │ Authentication:      │                    │ Real-time:        │
    │ - Personal Token     │                    │ - Listeners       │
    │ - OAuth (optional)   │                    │ - Snapshots       │
    │                      │                    │                   │
    └──────────────────────┘                    │ Permissions:      │
                                                │ - Public read     │
                                                │ - Validated write │
                                                │                   │
                                                └───────────────────┘
```

---

## Data Flow Diagram

### 1. Reading a Blog Post

```
User visits /blog/my-post
        │
        ▼
    Next.js [slug]/page.tsx
        │
        ├─→ getStaticParams() → fetch from GitHub
        │
        ├─→ getStaticProps() → build-time
        │
        ├─→ Display HTML + CSS
        │
        └─→ Component loads FirebaseComments
                │
                ▼
            Real-time listener on Firestore
                │
                ├─→ WHERE postSlug == "my-post"
                ├─→ WHERE approved == true
                ├─→ ORDER BY createdAt DESC
                │
                ▼
            Display comments on page
```

### 2. Creating a Blog Post

```
Admin clicks "New Post" → /admin/create form
        │
        ▼
    User fills form
    - Title
    - Content (Markdown)
    - Author
    - Tags
    - Image URL
        │
        ▼
    Form submission → POST /api/posts
        │
        ▼
    API validates data
        │
        ▼
    GitHub API PUT request
        │
        ├─→ Generate frontmatter from metadata
        ├─→ Combine with markdown content
        ├─→ Encode to base64
        ├─→ Create file: posts/title-slug.md
        │
        ▼
    GitHub webhook triggered
        │
        ├─→ Notify Cloudflare Pages
        ├─→ Build runs: npm run build
        ├─→ generateStaticParams() fetches all posts
        ├─→ Next.js generates static HTML
        │
        ▼
    Deploy to CDN
        │
        ▼
    Post is LIVE globally within 2-5 minutes
```

### 3. Moderating Comments

```
Reader submits comment → POST /api/comments
        │
        ├─→ Validate required fields
        ├─→ Save to Firestore with approved=false
        │
        ▼
Real-time listener triggers
        │
        ▼
    Admin dashboard shows pending
        │
        ▼
    Admin clicks "Approve"
        │
        ├─→ updateDoc() → Firestore
        ├─→ approved = true
        │
        ▼
Real-time listener re-fires
        │
        ▼
    Blog post comments section updates
    Comment now visible to all users
```

### 4. Newsletter Subscription

```
User enters email → POST /api/subscribe
        │
        ├─→ Validate email format
        ├─→ Check for duplicates
        ├─→ addDoc() → Firestore/subscribers
        │
        ▼
    Save with:
    - email
    - subscribedAt (server timestamp)
    - postSlug (which post they subscribed from)
        │
        ▼
Admin can later:
- View all subscribers
- Export to CSV
- Send newsletter emails
- Manage list
```

---

## File Structure & Data Flow

```
ailodi-main/
│
├── app/
│   ├── [slug]/page.tsx
│   │   └─→ Reads from: GitHub (posts)
│   │       Displays: FirebaseComments
│   │
│   ├── admin/
│   │   ├── login/page.tsx → POST /api/auth/login
│   │   └── dashboard/page.tsx
│   │       ├─→ OverviewTab → GET /api/posts, Firestore
│   │       ├─→ ContentTab → GET /api/posts, DELETE /api/posts/delete
│   │       ├─→ CommentsTab → Firestore listeners
│   │       └─→ SubscribersTab → Firestore listeners
│   │
│   └── api/
│       ├── auth/
│       │   ├── login/ → Sets session cookie
│       │   └── logout/ → Clears session cookie
│       │
│       ├── posts/
│       │   ├── route.ts → GET/POST GitHub
│       │   └── delete/route.ts → DELETE GitHub
│       │
│       ├── comments/route.ts → GET/POST Firestore
│       │
│       └── subscribe/route.ts → POST Firestore
│
├── components/
│   ├── firebase-comments.tsx → Real-time Firestore
│   │   └─→ onSnapshot() listener
│   │
│   ├── admin/tabs/
│   │   ├── overview-tab.tsx → Fetch stats
│   │   ├── content-tab.tsx → Manage posts
│   │   ├── comments-tab.tsx → Moderate comments
│   │   └── subscribers-tab.tsx → Manage subscribers
│   │
│   └── footer.tsx → Links to /admin/login
│
├── lib/
│   ├── firebase.ts → Initialize Firebase
│   ├── github.ts → GitHub API utilities
│   ├── auth.ts → Session management
│   └── content.ts → Content utilities
│
└── middleware.ts → Protect /admin routes
```

---

## API Request/Response Flows

### Authentication Flow

```
┌─────────────────┐
│   Login Form    │
└────────┬────────┘
         │ POST password
         ▼
┌─────────────────────────────────────────┐
│ POST /api/auth/login                    │
│ { password: "admin123" }                │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Server:                                 │
│ 1. Receive password                     │
│ 2. Compare with ADMIN_PASSWORD env var  │
│ 3. If match → create session cookie     │
│ 4. Set-Cookie: admin-session=true       │
└────────┬────────────────────────────────┘
         │ { success: true }
         ▼
┌─────────────────┐
│ Redirect to     │
│ /admin/dashboard│
└─────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Dashboard loads (middleware checks)     │
│ Cookie found → Allow access             │
│ No cookie → Redirect to /admin/login    │
└─────────────────────────────────────────┘
```

### Post Creation Flow

```
┌──────────────────┐
│ Admin Form       │
│ - title          │
│ - content        │
│ - author         │
│ - tags           │
│ - categories     │
│ - image          │
└────────┬─────────┘
         │ POST /api/posts
         │ { title, content, author, ... }
         ▼
┌───────────────────────────────────────────┐
│ Node.js API Route                         │
│                                           │
│ 1. Validate input                         │
│ 2. Generate slug: "my-title" → "my-title"│
│ 3. Create frontmatter YAML                │
│ 4. Combine: frontmatter + content         │
│ 5. Encode to Base64                       │
└────────┬────────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────────┐
│ GitHub API Request                        │
│                                           │
│ PUT /repos/owner/repo/contents/          │
│     posts/my-title.md                     │
│                                           │
│ Headers:                                  │
│ - Authorization: token GITHUB_TOKEN       │
│ - Content-Type: application/json          │
│                                           │
│ Body:                                     │
│ {                                         │
│   "message": "Add post: My Title",       │
│   "content": "base64_encoded...",        │
│   "branch": "main"                       │
│ }                                         │
└────────┬────────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────────┐
│ GitHub Actions                            │
│ Webhook triggered on push to main         │
│                                           │
│ 1. Webhook → Cloudflare Pages             │
│ 2. Build environment:                     │
│    - node_modules installed               │
│    - npm run build executes               │
│    - generateStaticParams() runs          │
│    - Fetches all .md from /posts          │
│    - Parses frontmatter                   │
│    - Generates static HTML                │
│ 3. .next/ folder created                  │
│ 4. Deploy to global CDN                   │
└────────┬────────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────────┐
│ Global CDN (70+ edge locations)           │
│                                           │
│ Request: GET /blog/my-title               │
│ Response: Pre-built HTML + CSS            │
│ Load time: 50-100ms globally              │
└───────────────────────────────────────────┘
```

---

## Database Schema Relationships

```
┌─────────────────────────────────────────────┐
│          Firestore Database                 │
│                                             │
│  ┌────────────────────────────────────┐   │
│  │ collections/comments               │   │
│  │                                    │   │
│  │ {                                  │   │
│  │   id: "comment-1"                  │   │
│  │   postSlug: "my-post" ─────┐       │   │
│  │   author: "John Doe"       │       │   │
│  │   content: "Great post!"   │       │   │
│  │   approved: true           │       │   │
│  │   parentId: null           │       │   │
│  │   createdAt: Timestamp     │       │   │
│  │ }                          │       │   │
│  │                            │       │   │
│  │ {                          │       │   │
│  │   id: "comment-2"          │       │   │
│  │   postSlug: "my-post" ─────┼───┐  │   │
│  │   author: "Jane Doe"       │   │  │   │
│  │   parentId: "comment-1" ───┼───┤  │   │
│  │   isAdmin: false           │   │  │   │
│  │   approved: true           │   │  │   │
│  │ }                          │   │  │   │
│  └────────────────────────────┼───┼──┘   │
│                               │   │      │
│  ┌────────────────────────────┘   │      │
│  │ collections/subscribers     │  │      │
│  │                             │  │      │
│  │ {                           │  │      │
│  │   id: "sub-1"              │  │      │
│  │   email: "user@email.com"   │  │      │
│  │   postSlug: "my-post" ──────┘  │      │
│  │   subscribedAt: Timestamp      │      │
│  │ }                              │      │
│  │                                │      │
│  │ {                              │      │
│  │   id: "sub-2"                  │      │
│  │   email: "other@email.com"      │      │
│  │   postSlug: null                │      │
│  │ }                              │      │
│  └────────────────────────────────┘      │
│                                             │
└─────────────────────────────────────────────┘
         ▲
         │ Real-time listeners
         │
    ┌────┴─────────────────┐
    │                      │
    ▼                      ▼
Admin Dashboard        Blog Pages
(Moderation)          (Display)
```

---

## Deployment Architecture

```
┌────────────────────────────────────────────────────┐
│         GitHub Repository (yourusername/repo)      │
│                                                    │
│  ├── /posts/*.md (Blog content)                   │
│  ├── /app (Next.js app)                           │
│  ├── /components (React components)               │
│  ├── /lib (Utilities)                             │
│  ├── /api (Route handlers)                        │
│  └── package.json                                 │
└────────────────────────────────────────────────────┘
         │
         │ Push to main branch
         ▼
┌────────────────────────────────────────────────────┐
│      Cloudflare Pages Webhook Triggered            │
│                                                    │
│  1. Clone repo                                    │
│  2. npm install                                   │
│  3. npm run build                                 │
│  4. Deploy .next/ to CDN                          │
└────────────────────────────────────────────────────┘
         │
         │ Deploy
         ▼
┌────────────────────────────────────────────────────┐
│  Global CDN (70+ edge locations)                  │
│  - Request routing                                 │
│  - Cache management                                │
│  - SSL/TLS termination                             │
│  - DDoS protection                                 │
│  - Global distribution                             │
└────────────────────────────────────────────────────┘
         │
         │ Serves requests
         ▼
┌────────────────────────────────────────────────────┐
│         End Users (Worldwide)                      │
│                                                    │
│  Average response time: 50-100ms                  │
│  Cache hit: 99%+                                  │
│  Uptime: 99.99%                                   │
└────────────────────────────────────────────────────┘
```

---

## Technology Stack Diagram

```
┌─────────────────────────────────────────────┐
│           Frontend Layer                     │
├─────────────────────────────────────────────┤
│ React 18 + Next.js 14 (App Router)          │
│ Tailwind CSS 3.4                            │
│ shadcn/ui Components                        │
│ Lucide React Icons                          │
│ next-themes (Dark Mode)                     │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│           Runtime Layer                      │
├─────────────────────────────────────────────┤
│ Node.js (Local Dev)                         │
│ Cloudflare Workers (Production)             │
│ TypeScript 5+                               │
│ ESLint (Code Quality)                       │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│         Backend Services Layer               │
├─────────────────────────────────────────────┤
│ GitHub API v3                               │
│ Firebase Admin SDK                          │
│ Next.js API Routes                          │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│           Database Layer                     │
├─────────────────────────────────────────────┤
│ GitHub Repository (.md files)               │
│ Firestore (Realtime Database)               │
│ Firebase Storage (Optional: Images)         │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│         Infrastructure Layer                 │
├─────────────────────────────────────────────┤
│ Cloudflare Pages (Hosting)                  │
│ Cloudflare CDN (Global Distribution)        │
│ SSL/TLS Certificates                        │
│ DDoS Protection                             │
└─────────────────────────────────────────────┘
```

---

**Last Updated**: November 14, 2025
**Diagrams Version**: 1.0
