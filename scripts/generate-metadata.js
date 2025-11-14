const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'https://blogform.netlify.app/api/content.json';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'AI Lodi';
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'AI Lodi is your ultimate guide to modern technology, AI breakthroughs, programming trends, and future science.';

// Helper function to normalize category names to slugs
function categoryToSlug(category) {
  return category
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Fetch with retry mechanism and explicit cache control
async function fetchWithRetry(url, options = {}, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      // Force fresh fetch with cache busting and unique timestamp
      const cacheBustUrl = `${url}?_t=${Date.now()}&_r=${Math.random()}&_build=${process.env.CF_PAGES_COMMIT_SHA || 'local'}`;
      
      const response = await fetch(cacheBustUrl, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'User-Agent': 'AI-Lodi-Build-Script/1.0',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers,
        },
        cache: 'no-store',
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (err) {
      console.error(`🔄 BUILD: Metadata fetch attempt ${i + 1} failed:`, err);
      if (i === retries - 1) throw err;
      // Exponential backoff with jitter
      await new Promise(res => setTimeout(res, (2000 * (i + 1)) + Math.random() * 1000));
    }
  }
  throw new Error('Max retries reached');
}

// Generate sitemap.xml
function generateSitemap(posts) {
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/categories/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/search/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/disclaimer/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Blog post URLs
  const blogPosts = posts.map((post) => {
    const postDate = new Date(post.updatedAt || post.publishDate);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let changeFrequency = 'monthly';
    if (daysSinceUpdate < 7) changeFrequency = 'daily';
    else if (daysSinceUpdate < 30) changeFrequency = 'weekly';
    else if (daysSinceUpdate < 365) changeFrequency = 'monthly';
    else changeFrequency = 'yearly';

    return {
      url: `${BASE_URL}/post/${post.slug}/`,
      lastModified: postDate,
      changeFrequency,
      priority: 0.9,
    };
  });

  // Category pages with new dynamic URLs
  const categoriesArray = posts.flatMap(post => post.categories || []);
  const categories = Array.from(new Set(categoriesArray));
  const categoryPages = categories.map((category) => ({
    url: `${BASE_URL}/categories/${categoryToSlug(category)}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const allPages = [...staticPages, ...blogPosts, ...categoryPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Main function
async function generateMetadata() {
  try {
    console.log('🔄 BUILD: Starting metadata generation with enhanced cache busting...');
    console.log('🔄 BUILD: Build environment:', {
      commit: process.env.CF_PAGES_COMMIT_SHA || 'local',
      branch: process.env.CF_PAGES_BRANCH || 'local',
      timestamp: new Date().toISOString()
    });
    
    const response = await fetchWithRetry(API_URL);
    const data = await response.json();
    
    // Validate and filter data
    if (!Array.isArray(data)) {
      console.error('❌ BUILD: API returned non-array data:', typeof data);
      throw new Error('Invalid API response format');
    }
    
    const publishedPosts = data.filter(post => {
      if (!post || typeof post !== 'object') return false;
      if (!post.id || !post.title || !post.slug || post.status !== 'published') return false;
      return true;
    });
    
    console.log(`📚 BUILD: Found ${publishedPosts.length} published posts`);
    console.log(`📝 BUILD: Latest posts:`, publishedPosts.slice(0, 5).map(p => `"${p.title}" (${p.slug})`));

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate and write sitemap
    console.log('🗺️ BUILD: Generating sitemap.xml with fresh content...');
    const sitemap = generateSitemap(publishedPosts);
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
    console.log('✅ BUILD: sitemap.xml generated successfully');

    // RSS feed is now handled by app/feed.xml/route.ts - no longer generating static file
    console.log('📡 BUILD: RSS feed handled by dynamic route (app/feed.xml/route.ts)');

    // Write a build info file for debugging
    const buildInfo = {
      timestamp: new Date().toISOString(),
      postsCount: publishedPosts.length,
      posts: publishedPosts.map(p => ({ title: p.title, slug: p.slug, updatedAt: p.updatedAt })),
      commit: process.env.CF_PAGES_COMMIT_SHA || 'local',
      branch: process.env.CF_PAGES_BRANCH || 'local'
    };
    fs.writeFileSync(path.join(publicDir, 'build-info.json'), JSON.stringify(buildInfo, null, 2), 'utf8');
    console.log('📋 BUILD: build-info.json generated for debugging');

    console.log('🎉 BUILD: All metadata files generated successfully with fresh content!');
  } catch (error) {
    console.error('❌ BUILD: Error generating metadata:', error);
    process.exit(1);
  }
}

// Run the script
generateMetadata();
