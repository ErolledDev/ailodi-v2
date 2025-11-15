import type { BlogPost } from '@/types/blog';

const GITHUB_API_URL = 'https://api.github.com';

interface GitHubPost {
  id: string;
  slug: string;
  title: string;
  author?: string;
  date: string;
  excerpt?: string;
  tags: string[];
  content: string;
  image?: string;
  categories: string[];
  metaDescription: string;
  status: string;
  publishDate: string;
  updatedAt: string;
}

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  content?: string;
}

// Parse frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterString = frontmatterMatch[1];
  const body = frontmatterMatch[2];

  const frontmatter: Record<string, any> = {};
  const lines = frontmatterString.split('\n');

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      
      // Handle different data types
      if (value.toLowerCase() === 'true') {
        frontmatter[key.trim()] = true;
      } else if (value.toLowerCase() === 'false') {
        frontmatter[key.trim()] = false;
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Parse array
        try {
          frontmatter[key.trim()] = JSON.parse(value);
        } catch {
          frontmatter[key.trim()] = value.slice(1, -1).split(',').map(v => v.trim());
        }
      } else {
        frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  return { frontmatter, body };
}

// Convert frontmatter object to markdown frontmatter string
function stringifyFrontmatter(frontmatter: Record<string, any>): string {
  const lines: string[] = [];
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
    } else if (typeof value === 'string') {
      lines.push(`${key}: "${value}"`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }

  return `---\n${lines.join('\n')}\n---`;
}

// Fetch all posts from GitHub
export async function fetchPostsFromGitHub(): Promise<GitHubPost[]> {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error('GitHub configuration missing (owner, repo, or token)');
  }

  try {
    // Get list of files in posts directory
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/posts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ailodi-cms',
        },
        cache: 'no-cache',
      }
    );

    if (!response.ok) {
      // If 404, posts directory doesn't exist yet - return empty array
      if (response.status === 404) {
        console.warn('Posts directory not found on GitHub. Create posts/ folder in your repo.');
        return [];
      }
      throw new Error(`Failed to fetch posts directory: ${response.status}`);
    }

    const files: GitHubFile[] = await response.json();
    const markdownFiles = files.filter(f => f.name.endsWith('.md') && f.type === 'file');

    // Fetch content for each markdown file
    const posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const contentResponse = await fetch(
          `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${file.path}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3.raw',
              'User-Agent': 'ailodi-cms',
            },
            cache: 'no-cache',
          }
        );

        if (!contentResponse.ok) {
          throw new Error(`Failed to fetch post: ${file.name}`);
        }

        const content = await contentResponse.text();
        const { frontmatter, body } = parseFrontmatter(content);

        // Generate slug from filename
        const slug = file.name.replace('.md', '');

        return {
          id: slug,
          slug,
          title: frontmatter.title || 'Untitled',
          author: frontmatter.author || 'Admin',
          date: frontmatter.date || new Date().toISOString(),
          excerpt: frontmatter.excerpt || '',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags ? frontmatter.tags.split(',').map((t: string) => t.trim()) : []),
          content: body,
          image: frontmatter.image || '',
          categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : (frontmatter.categories ? frontmatter.categories.split(',').map((c: string) => c.trim()) : []),
          metaDescription: frontmatter.metaDescription || frontmatter.excerpt || '',
          status: frontmatter.status || 'published',
          publishDate: frontmatter.date || new Date().toISOString(),
          updatedAt: frontmatter.updatedAt || frontmatter.date || new Date().toISOString(),
        } as GitHubPost;
      })
    );

    // Sort by date descending
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching posts from GitHub:', error);
    throw error;
  }
}

// Fetch a single post by slug
export async function fetchPostBySlug(slug: string): Promise<GitHubPost | null> {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error('GitHub configuration missing');
  }

  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/posts/${slug}.md`,
      {
        headers: {
          Authorization: `token ${token}`,
          'Accept': 'application/vnd.github.v3.raw',
        },
        cache: 'no-cache',
      }
    );

    if (!response.ok) {
      return null;
    }

    const content = await response.text();
    const { frontmatter, body } = parseFrontmatter(content);

    return {
      id: slug,
      slug,
      title: frontmatter.title || 'Untitled',
      author: frontmatter.author || 'Admin',
      date: frontmatter.date || new Date().toISOString(),
      excerpt: frontmatter.excerpt || '',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags ? frontmatter.tags.split(',').map((t: string) => t.trim()) : []),
      content: body,
      image: frontmatter.image || '',
      categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : (frontmatter.categories ? frontmatter.categories.split(',').map((c: string) => c.trim()) : []),
      metaDescription: frontmatter.metaDescription || frontmatter.excerpt || '',
      status: frontmatter.status || 'published',
      publishDate: frontmatter.date || new Date().toISOString(),
      updatedAt: frontmatter.updatedAt || frontmatter.date || new Date().toISOString(),
    } as GitHubPost;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

// Create a new post on GitHub
export async function createPostOnGitHub(
  title: string,
  content: string,
  metadata: {
    author?: string;
    excerpt?: string;
    tags?: string[];
    categories?: string[];
    image?: string;
  }
): Promise<{ success: boolean; slug: string }> {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error('GitHub configuration missing');
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const frontmatter = {
    title,
    date: new Date().toISOString(),
    author: metadata.author || 'Admin',
    excerpt: metadata.excerpt || '',
    tags: metadata.tags || [],
    categories: metadata.categories || [],
    image: metadata.image || '',
    status: 'published',
  };

  const markdownContent = `${stringifyFrontmatter(frontmatter)}\n\n${content}`;

  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/posts/${slug}.md`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add post: ${title}`,
          content: Buffer.from(markdownContent).toString('base64'),
          branch: 'main',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.status}`);
    }

    return { success: true, slug };
  } catch (error) {
    console.error('Error creating post on GitHub:', error);
    throw error;
  }
}

// Update an existing post on GitHub
export async function updatePostOnGitHub(
  slug: string,
  title: string,
  content: string,
  metadata: {
    author?: string;
    excerpt?: string;
    tags?: string[];
    categories?: string[];
    image?: string;
  }
): Promise<{ success: boolean }> {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error('GitHub configuration missing');
  }

  try {
    // Get current file SHA
    const getResponse = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/posts/${slug}.md`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );

    if (!getResponse.ok) {
      throw new Error(`Post not found: ${slug}`);
    }

    const { sha } = await getResponse.json();

    const frontmatter = {
      title,
      date: new Date().toISOString(),
      author: metadata.author || 'Admin',
      excerpt: metadata.excerpt || '',
      tags: metadata.tags || [],
      categories: metadata.categories || [],
      image: metadata.image || '',
      status: 'published',
    };

    const markdownContent = `${stringifyFrontmatter(frontmatter)}\n\n${content}`;

    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/posts/${slug}.md`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update post: ${title}`,
          content: Buffer.from(markdownContent).toString('base64'),
          sha,
          branch: 'main',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating post on GitHub:', error);
    throw error;
  }
}

// Delete a post from GitHub
export async function deletePostOnGitHub(slug: string): Promise<{ success: boolean }> {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error('GitHub configuration missing');
  }

  try {
    // Get current file SHA
    const getResponse = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/posts/${slug}.md`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );

    if (!getResponse.ok) {
      throw new Error(`Post not found: ${slug}`);
    }

    const { sha } = await getResponse.json();

    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/posts/${slug}.md`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete post: ${slug}`,
          sha,
          branch: 'main',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting post from GitHub:', error);
    throw error;
  }
}
