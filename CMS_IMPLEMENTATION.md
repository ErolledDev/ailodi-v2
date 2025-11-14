# AI Lodi CMS Implementation Guide

## Overview

This document outlines the complete implementation of the new GitHub + Firebase CMS system for AI Lodi. The system includes:

- **GitHub-Based Content Management**: Write posts directly in GitHub markdown files
- **Firebase Real-time Database**: Comments and subscriber management
- **Admin Dashboard**: 4-tab interface for managing all aspects
- **Authentication**: Password-protected admin access

---

## Installation & Setup

### Step 1: Install Dependencies

```bash
cd ailodi-main
npm install
```

This will install the new Firebase dependency (`firebase: ^10.7.0`)

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with:

#### GitHub Configuration
```
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=your-repo-name
```

**How to get GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it scope: `repo` (full control of repositories)
4. Copy the token and paste it in `.env.local`

#### Admin Authentication
```
ADMIN_PASSWORD=your-secure-admin-password
```

#### Firebase Configuration
1. Go to https://console.firebase.google.com/
2. Create a new project or use an existing one
3. Enable Firestore Database
4. Enable Firebase Storage
5. Copy the configuration values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Step 3: Start Development Server

```bash
npm run dev
```

Access the application at `http://localhost:3000`

---

## Features & Architecture

### 1. Admin Dashboard (`/admin/dashboard`)

Protected by password authentication. Navigate to `/admin/login` to access.

#### Overview Tab
- Total posts count
- Total comments count
- Subscriber count (with pending comments indicator)
- Quick action buttons

#### Content Tab
- List all blog posts
- Edit posts
- Delete posts
- Create new posts
- View published posts

#### Comments Tab
- List all comments with real-time updates
- Filter by status: All, Pending, Approved
- Approve comments
- Delete comments
- See which blog post each comment is for

#### Subscribers Tab
- List all newsletter subscribers
- Export subscriber list to CSV
- Remove subscribers
- View subscription source

### 2. GitHub CMS Integration

Posts are stored in your GitHub repository in the `/posts` folder as Markdown files with frontmatter:

```markdown
---
title: My Blog Post
date: 2025-11-14
author: Your Name
excerpt: Brief post description
tags: tag1, tag2
categories: category1, category2
image: https://...image-url
status: published
---

# Post content starts here

Your markdown content...
```

**Files Created:**
- `lib/github.ts` - GitHub API utilities for CRUD operations
- `app/api/posts/route.ts` - Fetch/create posts endpoint
- `app/api/posts/delete/route.ts` - Delete posts endpoint

### 3. Firebase Real-time Features

#### Firestore Collections

**comments**
- Real-time comment display
- Moderation system (approved/pending)
- Admin replies with @ mentions
- Automatic server timestamps

**subscribers**
- Newsletter subscription management
- Track subscription source (which post)
- Export to CSV

**Files Created:**
- `lib/firebase.ts` - Firebase configuration
- `components/firebase-comments.tsx` - Comment component
- `app/api/comments/route.ts` - Comments endpoint
- `app/api/subscribe/route.ts` - Updated to use Firebase

### 4. Authentication System

**Files Created:**
- `lib/auth.ts` - Session management utilities
- `app/api/auth/login/route.ts` - Login endpoint
- `app/api/auth/logout/route.ts` - Logout endpoint
- `app/admin/login/page.tsx` - Login page
- `app/admin/layout.tsx` - Auth protection wrapper
- `middleware.ts` - Route protection

**Flow:**
1. User navigates to `/admin/login`
2. Enters admin password (from `ADMIN_PASSWORD` env var)
3. Password verified on server
4. Secure HTTP-only cookie set
5. Redirected to `/admin/dashboard`

---

## File Structure

```
ailodi-main/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard with tabs
│   │   └── layout.tsx                # Auth protection
│   └── api/
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts          # Login endpoint
│       │   └── logout/
│       │       └── route.ts          # Logout endpoint
│       ├── posts/
│       │   ├── route.ts              # GET/POST posts
│       │   └── delete/
│       │       └── route.ts          # DELETE posts
│       ├── comments/
│       │   └── route.ts              # Comments CRUD
│       └── subscribe/
│           └── route.ts              # Updated for Firebase
│
├── components/
│   ├── admin/
│   │   └── tabs/
│   │       ├── overview-tab.tsx       # Dashboard stats
│   │       ├── content-tab.tsx        # Posts management
│   │       ├── comments-tab.tsx       # Comments moderation
│   │       └── subscribers-tab.tsx    # Subscriber management
│   ├── firebase-comments.tsx          # Comments display component
│   └── footer.tsx                     # Updated with Dashboard CTA
│
├── lib/
│   ├── firebase.ts                    # Firebase config
│   ├── github.ts                      # GitHub API utilities
│   ├── auth.ts                        # Auth utilities
│   ├── content.ts                     # Existing content utilities
│   └── utils.ts                       # Existing utilities
│
├── middleware.ts                      # Route protection
├── .env.example                       # Updated env template
├── package.json                       # Added firebase dependency
└── ...
```

---

## API Endpoints

### Authentication

**POST /api/auth/login**
```json
{
  "password": "admin-password"
}
```
Response: `{ "success": true }` + Sets session cookie

**POST /api/auth/logout**
Response: `{ "success": true }` + Clears session cookie

### Posts

**GET /api/posts**
Fetches all posts from GitHub

**POST /api/posts**
```json
{
  "title": "Post Title",
  "content": "Markdown content",
  "author": "Author Name",
  "excerpt": "Short description",
  "tags": "tag1,tag2",
  "categories": "cat1,cat2",
  "image": "https://...image-url"
}
```

**DELETE /api/posts/delete**
```json
{
  "slug": "post-slug"
}
```
(Requires authentication)

### Comments

**GET /api/comments**
Fetches all comments from Firebase

**POST /api/comments**
```json
{
  "postSlug": "post-slug",
  "author": "Commenter Name",
  "email": "email@example.com",
  "content": "Comment text"
}
```

### Newsletter

**POST /api/subscribe**
```json
{
  "email": "subscriber@example.com",
  "postSlug": "optional-post-slug"
}
```

---

## Footer Update

The footer now shows a "Dashboard" button instead of "Subscribe" that links to `/admin/login`:

```tsx
<Link
  href="/admin/login"
  className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
>
  <Github size={16} />
  Dashboard
</Link>
```

---

## Workflow Examples

### Creating a New Blog Post

#### Option 1: Via Admin Dashboard
1. Visit `yourblog.com/admin/dashboard`
2. Click "New Post" button
3. Fill in post details (title, content, tags, etc.)
4. Submit
5. Post is automatically created on GitHub in `/posts` folder
6. GitHub webhook triggers build (if configured)
7. Post is live within minutes

#### Option 2: Directly on GitHub
1. Go to your GitHub repository
2. Navigate to `/posts` folder
3. Create new file: `my-post-title.md`
4. Write markdown with frontmatter
5. Commit to main branch
6. Webhook triggers build
7. Post is live

### Moderating Comments

1. Go to `/admin/dashboard`
2. Click "Comments" tab
3. See pending comments (highlighted in yellow)
4. Click "Approve" to publish comment
5. Or click trash icon to delete
6. Admin can also reply to comments

### Managing Subscribers

1. Go to `/admin/dashboard`
2. Click "Subscribers" tab
3. See all newsletter subscribers
4. Export to CSV with "Export CSV" button
5. Delete individual subscribers as needed

---

## Removing Valine Comments

The Valine comment system has been completely removed and replaced with Firebase comments:

**Removed:**
- `components/valine-comments.tsx` - Still exists but not used
- Valine API configuration from `.env.example`
- LeanCloud dependencies

**New Component:**
- `components/firebase-comments.tsx` - Replaces Valine with real-time Firebase comments

**Usage in blog post pages:**
Replace:
```tsx
import { ValineComments } from '@/components/valine-comments';

<ValineComments path={slug} />
```

With:
```tsx
import { FirebaseComments } from '@/components/firebase-comments';

<FirebaseComments postSlug={slug} />
```

---

## Security Features

### Authentication
- Password-protected admin access
- HTTP-only secure cookies
- Session expiration (24 hours)
- Server-side password verification

### Firebase Security Rules
```javascript
// Comments: Public read, moderated write
// Subscribers: Email validation, duplicate prevention
// Admin operations: Server-side verification only
```

### GitHub Token
- Never exposed to client
- Only used server-side
- Can be regenerated at any time

---

## Deployment to Cloudflare Pages

### Prerequisites
- GitHub repository connected to Cloudflare Pages
- Environment variables set in Cloudflare dashboard

### Step 1: Add Environment Variables to Cloudflare

Go to your Cloudflare Pages project → Settings → Environment variables

Add (as **Secret**):
- `GITHUB_TOKEN`
- `ADMIN_PASSWORD`
- `FIREBASE_ADMIN_SDK_KEY` (if using admin operations)

Add (as **Public**):
- All `NEXT_PUBLIC_*` variables

### Step 2: Push to GitHub

```bash
git add .
git commit -m "feat: Add GitHub + Firebase CMS"
git push origin main
```

Cloudflare will automatically:
1. Build with `npm run build`
2. Deploy to global CDN
3. Make posts live

### Step 3: Configure GitHub Webhook (Optional)

For automatic rebuilds when posts are pushed:
1. Go to your GitHub repo → Settings → Webhooks
2. Click "Add webhook"
3. Payload URL: Your Cloudflare Pages build webhook URL
4. Content type: application/json
5. Events: Push events

---

## Troubleshooting

### Posts Not Showing

**Check:**
1. GitHub token is valid
2. Repository owner and name are correct
3. Posts folder exists in GitHub
4. Files are named `*.md`

**Debug:**
```bash
# Check if posts are being fetched
npm run dev
# Navigate to /api/posts in browser
```

### Comments Not Working

**Check:**
1. Firebase project is created
2. Firestore database is enabled
3. All Firebase config variables are set correctly
4. Browser console for errors

**Debug:**
```javascript
// In browser console
import { db } from '@/lib/firebase';
console.log(db);
```

### Login Not Working

**Check:**
1. `ADMIN_PASSWORD` is set in `.env.local`
2. No typos in password
3. Browser cookies are enabled

**Debug:**
```bash
# Check environment variables are loaded
echo $ADMIN_PASSWORD
```

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Configure environment variables**: Copy and fill `.env.example` to `.env.local`
3. **Set up Firebase**: Create Firebase project and enable Firestore + Storage
4. **Test locally**: `npm run dev` then visit `/admin/login`
5. **Deploy**: Push to GitHub, Cloudflare Pages will build automatically

---

## Support & Documentation

- **GitHub Integration**: See `lib/github.ts` for available functions
- **Firebase Setup**: https://firebase.google.com/docs/firestore/quickstart
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/

---

**Last Updated**: November 14, 2025
**Version**: 1.0.0
