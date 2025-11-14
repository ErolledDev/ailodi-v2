# API Reference - AI Lodi CMS

Complete API documentation for all endpoints.

---

## Authentication Endpoints

### POST /api/auth/login

Admin login endpoint.

**Request:**
```json
{
  "password": "your-admin-password"
}
```

**Response (200):**
```json
{
  "success": true
}
```
Sets `admin-session` HTTP-only cookie.

**Errors:**
- `400` - Missing password
- `401` - Invalid password
- `500` - Server error

**Example:**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'mypassword' })
});
```

---

### POST /api/auth/logout

Admin logout endpoint.

**Request:**
(No body required)

**Response (200):**
```json
{
  "success": true
}
```
Clears `admin-session` cookie.

**Example:**
```javascript
await fetch('/api/auth/logout', { method: 'POST' });
```

---

## Posts Endpoints

### GET /api/posts

Fetch all blog posts from GitHub.

**Response (200):**
```json
[
  {
    "id": "post-slug",
    "slug": "post-slug",
    "title": "My Blog Post",
    "author": "Author Name",
    "date": "2025-11-14T10:30:00Z",
    "excerpt": "Post description",
    "tags": ["tag1", "tag2"],
    "content": "Full markdown content...",
    "image": "https://example.com/image.jpg",
    "categories": ["category1"],
    "metaDescription": "Meta description",
    "status": "published",
    "publishDate": "2025-11-14T10:30:00Z",
    "updatedAt": "2025-11-14T10:30:00Z"
  }
]
```

**Errors:**
- `500` - Failed to fetch from GitHub

**Example:**
```javascript
const posts = await fetch('/api/posts').then(r => r.json());
console.log(posts[0].title);
```

---

### POST /api/posts

Create a new blog post on GitHub.

**Request:**
```json
{
  "title": "New Blog Post",
  "content": "# Markdown content\n\nYour content here...",
  "author": "Author Name",
  "excerpt": "Short description",
  "tags": "tag1,tag2",
  "categories": "category1,category2",
  "image": "https://example.com/image.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "content": {
      "path": "posts/new-blog-post.md",
      "sha": "abc123..."
    }
  }
}
```

**Errors:**
- `400` - Missing title or content
- `500` - Failed to create post

**Example:**
```javascript
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Post',
    content: '# Content',
    author: 'Me'
  })
});
```

---

### DELETE /api/posts/delete

Delete a blog post from GitHub. **Requires authentication.**

**Request:**
```json
{
  "slug": "post-slug"
}
```

**Response (200):**
```json
{
  "success": true
}
```

**Errors:**
- `401` - Not authenticated
- `400` - Missing slug
- `404` - Post not found
- `500` - Failed to delete

**Example:**
```javascript
const response = await fetch('/api/posts/delete', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ slug: 'my-post' })
});
```

---

## Comments Endpoints

### GET /api/comments

Fetch all comments from Firebase.

**Response (200):**
```json
[
  {
    "id": "comment-id",
    "postSlug": "blog-post-slug",
    "author": "Commenter Name",
    "email": "commenter@example.com",
    "content": "This is a comment...",
    "approved": true,
    "isAdmin": false,
    "parentId": null,
    "createdAt": "2025-11-14T10:30:00Z"
  }
]
```

**Example:**
```javascript
const comments = await fetch('/api/comments').then(r => r.json());
```

---

### POST /api/comments

Submit a new comment on a blog post.

**Request:**
```json
{
  "postSlug": "blog-post-slug",
  "author": "Your Name",
  "email": "your@email.com",
  "content": "Your comment text here...",
  "parentId": "parent-comment-id" // optional, for replies
}
```

**Response (201):**
```json
{
  "id": "new-comment-id",
  "postSlug": "blog-post-slug",
  "author": "Your Name",
  "content": "Your comment text here...",
  "approved": false
}
```

**Errors:**
- `400` - Missing required fields
- `500` - Failed to create comment

**Example:**
```javascript
const response = await fetch('/api/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    postSlug: 'my-post',
    author: 'John Doe',
    content: 'Great post!'
  })
});
```

---

## Newsletter Endpoints

### POST /api/subscribe

Subscribe an email to the newsletter.

**Request:**
```json
{
  "email": "subscriber@example.com",
  "postSlug": "optional-blog-post-slug"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Successfully subscribed to AI Lodi newsletter!",
  "id": "subscriber-id"
}
```

**Errors:**
- `400` - Invalid email format
- `409` - Email already subscribed
- `500` - Server error

**Example:**
```javascript
const response = await fetch('/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newsubscriber@gmail.com'
  })
});
```

---

## Response Format

All endpoints use standard HTTP status codes:

| Code | Meaning |
|------|---------|
| `200` | Success (GET, DELETE) |
| `201` | Created (POST) |
| `400` | Bad request (validation error) |
| `401` | Unauthorized (requires auth) |
| `404` | Not found |
| `409` | Conflict (duplicate email, etc.) |
| `500` | Server error |

### Standard Error Response:
```json
{
  "error": "Description of what went wrong"
}
```

---

## Authentication

Protected endpoints require a valid session cookie (`admin-session=true`).

Set by logging in at `/api/auth/login`.

Example with credentials:
```javascript
// Login first
await fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include', // Include cookies
  body: JSON.stringify({ password: 'adminpass' })
});

// Now make authenticated request
await fetch('/api/posts/delete', {
  method: 'DELETE',
  credentials: 'include',
  body: JSON.stringify({ slug: 'post-name' })
});
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- GitHub API rate limits (60 requests/hour for unauthenticated, 5,000 for authenticated)
- Firebase write limits (configurable)
- Implement API throttling in middleware

---

## CORS Policy

- Endpoints are server-only (no CORS issues)
- Subscribe endpoint has CORS headers for external forms
- Auth endpoints require same-origin requests

---

## Request Headers

Recommended headers for all requests:

```javascript
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
```

---

## Response Headers

Standard response headers:

```
Content-Type: application/json
X-Content-Type-Options: nosniff
```

---

## Error Handling Examples

### Handle comment creation error:
```javascript
try {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      postSlug: 'my-post',
      author: 'Name',
      content: ''
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.error);
    // Display error to user
  } else {
    const comment = await response.json();
    console.log('Comment created:', comment.id);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

---

## Pagination

Currently no pagination is implemented. All endpoints return complete results.

For large datasets, consider implementing:
- Limit/offset parameters
- Cursor-based pagination
- Server-side filtering

---

## Caching

- GET endpoints: Cached by browser/CDN
- POST/DELETE: No cache (always fresh)
- Real-time updates: Use Firebase listeners

---

## API Versioning

Current version: `v1` (implicit in route structure)

No breaking changes currently. Future versions would use `/api/v2/` etc.

---

## Example: Complete Flow

```javascript
// 1. Login
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'admin123' }),
  credentials: 'include'
});

// 2. Create post
const createRes = await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My New Post',
    content: '# Markdown content here',
    author: 'Admin',
    excerpt: 'Short description'
  })
});

// 3. Get all posts
const posts = await fetch('/api/posts').then(r => r.json());
console.log(`Published ${posts.length} posts`);

// 4. Subscribe user
const subRes = await fetch('/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'reader@example.com',
    postSlug: posts[0].slug
  })
});

// 5. Logout
await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
});
```

---

## SDK Examples

### Using fetch (Native)
```javascript
const response = await fetch('/api/posts');
const data = await response.json();
```

### Using axios
```javascript
import axios from 'axios';

const response = await axios.get('/api/posts');
const data = response.data;
```

### Using SWR (Next.js)
```javascript
import useSWR from 'swr';

function Posts() {
  const { data, error } = useSWR('/api/posts');
  
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return <div>{data.length} posts</div>;
}
```

---

## Webhook Integration

GitHub webhooks can trigger on push to `/posts` directory:

```bash
Payload URL: https://yourdomain.com/api/webhooks/github
Events: Push
```

Then create `/app/api/webhooks/github/route.ts` to handle rebuilds.

---

**Last Updated**: November 14, 2025
**API Version**: 1.0.0
