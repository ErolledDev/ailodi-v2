# Quick Start Guide - AI Lodi CMS

## 5-Minute Setup

### Step 1: Install Dependencies (2 min)
```bash
npm install
```

### Step 2: Create Environment File (1 min)
```bash
cp .env.example .env.local
```

### Step 3: Get GitHub Token (1 min)
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `ailodi-cms`
4. Scope: `repo`
5. Generate and copy token

### Step 4: Setup Firebase (Optional but Recommended)
1. Go to https://console.firebase.google.com/
2. Create new project or use existing
3. Enable Firestore Database
4. Copy config values

### Step 5: Configure .env.local (1 min)
Edit `.env.local` and add:
```env
# GitHub
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=your-repo-name

# Admin
ADMIN_PASSWORD=your-secure-password

# Firebase (for comments & subscribers)
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

---

## Run Locally

```bash
npm run dev
```

Visit:
- Blog: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- Password: (whatever you set in ADMIN_PASSWORD)

---

## Access Points

| URL | Purpose |
|-----|---------|
| `/` | Home page |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post with comments |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Dashboard (4 tabs) |

---

## Admin Dashboard Tabs

### 1. Overview
- See stats (posts, comments, subscribers)
- Quick action buttons

### 2. Content
- List all posts
- Edit posts
- Delete posts
- Create new posts

### 3. Comments
- See all comments
- Approve pending
- Delete comments

### 4. Subscribers
- View all subscribers
- Export to CSV
- Delete individual subscribers

---

## Creating Your First Post

### Via Dashboard (Easiest)
1. Login at `/admin/login`
2. Click "New Post"
3. Fill in details
4. Submit
5. Post created automatically

### Via GitHub (Advanced)
1. Go to your GitHub repo
2. Create file: `posts/my-post.md`
3. Add content:
```markdown
---
title: My First Post
date: 2025-11-14
author: Your Name
excerpt: Description
tags: tag1, tag2
categories: category1
image: https://...image-url
---

# Post Content

Your markdown here...
```
4. Commit to main
5. Post is live!

---

## Deploy to Cloudflare Pages

### 1. Connect Repository
1. Go to https://dash.cloudflare.com/
2. Click "Pages"
3. "Create a project"
4. Connect GitHub
5. Select repository
6. Build command: `npm run build`
7. Build directory: `.next`

### 2. Set Environment Variables
In Cloudflare Pages → Settings → Environment:
- Add all `NEXT_PUBLIC_*` variables
- Add `GITHUB_TOKEN`, `ADMIN_PASSWORD` as **Secret**

### 3. Deploy
Push to GitHub main branch - automatic deployment!

---

## Troubleshooting

### Posts Not Showing
- Check GitHub token is valid
- Verify repo name is correct
- Create `/posts` folder if missing

### Comments Not Working
- Check Firebase is configured
- Verify all Firebase env vars
- Check browser console

### Login Not Working
- Check `ADMIN_PASSWORD` is set
- Clear browser cookies
- Check password spelling

### Firebase Errors
- Verify all `NEXT_PUBLIC_FIREBASE_*` vars
- Enable Firestore in Firebase Console
- Check Firebase rules (should allow public read)

---

## File Locations

- **Posts**: `/posts/*.md` in GitHub repo
- **Config**: `.env.local`
- **Dashboard**: `/app/admin/dashboard`
- **Comments**: `/components/firebase-comments.tsx`
- **API**: `/app/api/*`

---

## Documentation

For detailed information, see:
- `CMS_IMPLEMENTATION.md` - Complete guide
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `.env.example` - All available variables

---

## What's Included

✅ GitHub-based CMS (no external service)
✅ Real-time Firebase comments
✅ Newsletter subscribers
✅ Admin dashboard
✅ Password authentication
✅ Mobile responsive
✅ Dark mode
✅ API endpoints
✅ Email export (CSV)
✅ Production ready

---

## Next: Advanced Features

Coming soon (optional enhancements):
- Email notifications
- Social media posting
- Comment notifications
- Post scheduling
- Analytics integration
- CDN image optimization

---

## Support

Having issues? Check:
1. Console for errors: F12 → Console
2. `.env.local` has all required variables
3. Firebase project is created
4. GitHub token has `repo` scope
5. Internet connection is working

---

**Ready to start? Run `npm install` then `npm run dev`!**
