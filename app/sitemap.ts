import { MetadataRoute } from 'next';
import { getAllContent } from '@/lib/content';

// Helper function to normalize category names to slugs
function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz';
  
  // Static pages with enhanced priority and frequency
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic blog posts and category pages with enhanced metadata
  let blogPosts: any[] = [];
  let categoryPages: any[] = [];
  
  try {
    console.log('🗺️ BUILD: Generating sitemap with fresh content...');
    
    // Force fresh content fetch for sitemap generation
    const posts = await getAllContent({ cache: 'no-store' });
    console.log(`🗺️ BUILD: Generating sitemap for ${posts.length} posts`);
    
    // Blog post URLs
    blogPosts = posts.map((post) => {
      const postDate = new Date(post.updatedAt);
      const now = new Date();
      const daysSinceUpdate = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Adjust change frequency based on post age
      let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
      if (daysSinceUpdate < 7) changeFrequency = 'daily';
      else if (daysSinceUpdate < 30) changeFrequency = 'weekly';
      else if (daysSinceUpdate < 365) changeFrequency = 'monthly';
      else changeFrequency = 'yearly';

      return {
        url: `${baseUrl}/post/${post.slug}/`,
        lastModified: postDate,
        changeFrequency,
        priority: 0.9,
      };
    });

    // Category pages with new dynamic URLs
    const categories = [...new Set(posts.flatMap(post => post.categories))];
    categoryPages = categories.map((category) => ({
      url: `${baseUrl}/categories/${categoryToSlug(category)}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    console.log(`🗺️ BUILD: Generated ${blogPosts.length} post URLs and ${categoryPages.length} category URLs`);

  } catch (error) {
    console.error('❌ BUILD: Error fetching posts for sitemap:', error);
  }

  return [...staticPages, ...blogPosts, ...categoryPages];
}