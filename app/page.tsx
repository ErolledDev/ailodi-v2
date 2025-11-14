import { BlogPosts } from '@/components/blog-posts';
import { Hero } from '@/components/hero';
import { LatestInsights } from '@/components/latest-insights';
import { getAllContent } from '@/lib/content';
import type { BlogPost } from '@/types/blog';

export default async function Home() {
  // Force fresh content fetch at build time with explicit cache control
  console.log('🏠 BUILD: Fetching content for homepage...');
  const allPosts = await getAllContent({ cache: 'no-store' });
  
  // Prepare data for components
  const latestPosts = allPosts.slice(0, 3);
  const allPostsForBlogSection = allPosts.slice(0, 5); // Initial posts for blog section

  console.log(`🏠 BUILD: Homepage loaded with ${allPosts.length} total posts, showing ${latestPosts.length} latest`);

  return (
    <div className="space-y-16">
      <Hero />
      <LatestInsights posts={latestPosts} />
      <BlogPosts initialPosts={allPostsForBlogSection} allPosts={allPosts} />
    </div>
  );
}