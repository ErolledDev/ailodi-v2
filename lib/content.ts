import type { BlogPost } from '@/types/blog';

const API_URL = 'https://blogform.netlify.app/api/content.json';

interface SearchResult {
  posts: BlogPost[];
  hasError: boolean;
  errorMessage?: string;
}

async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retries = 5
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      // Remove cache-busting parameters to ensure static URL
      const cleanUrl = new URL(url);
      cleanUrl.searchParams.delete('_t');
      cleanUrl.searchParams.delete('_r');
      const staticUrl = cleanUrl.toString();
      
      // Filter out dynamic cache headers from options
      const filteredHeaders = { ...options.headers };
      if (filteredHeaders && typeof filteredHeaders === 'object') {
        delete (filteredHeaders as any)['Cache-Control'];
        delete (filteredHeaders as any)['Pragma'];
        delete (filteredHeaders as any)['Expires'];
      }
      
      // Use static fetch configuration for build-time caching
      const response = await fetch(staticUrl, {
        ...options,
        cache: 'force-cache', // Force static caching for build
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AI-Lodi-Blog/1.0',
          ...filteredHeaders,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (err) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`🔄 BUILD: Fetch attempt ${i + 1} failed:`, err);
      }
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, 2000 * (i + 1))); // Exponential backoff
    }
  }
  throw new Error('Max retries reached');
}

export async function getAllContent(options: RequestInit = {}): Promise<BlogPost[]> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 BUILD: Fetching content from API...');
    }
    
    const response = await fetchWithRetry(API_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AI-Lodi-Blog/1.0',
      },
      ...options,
    });
    
    const data = await response.json();
    
    // Validate data structure
    if (!Array.isArray(data)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ BUILD: API returned non-array data:', typeof data);
      }
      return [];
    }
    
    const publishedPosts = data.filter((post: any) => {
      // Validate post structure
      if (!post || typeof post !== 'object') return false;
      if (!post.id || !post.title || !post.slug || post.status !== 'published') return false;
      return true;
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📚 BUILD: Successfully fetched ${publishedPosts.length} published posts`);
      console.log(`📝 BUILD: Latest posts:`, publishedPosts.slice(0, 3).map((p: BlogPost) => p.title));
    }
    
    // Sort by updated date to ensure consistent ordering
    const sortedPosts = publishedPosts.sort((a: BlogPost, b: BlogPost) => 
      new Date(b.updatedAt || b.publishDate).getTime() - new Date(a.updatedAt || a.publishDate).getTime()
    );
    
    return sortedPosts;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ BUILD: Error fetching content:', error);
    }
    return [];
  }
}

export async function getContentBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 BUILD: Fetching content for slug: ${slug}`);
    }
    
    const response = await fetchWithRetry(API_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AI-Lodi-Blog/1.0',
      },
    });
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ BUILD: API returned non-array data for slug fetch');
      }
      return null;
    }
    
    const publishedPosts = data.filter((post: any) => 
      post && typeof post === 'object' && post.status === 'published'
    );
    
    const post = publishedPosts.find((p: BlogPost) => p.slug === slug);
    
    if (process.env.NODE_ENV === 'development') {
      if (post) {
        console.log(`✅ BUILD: Found post: ${post.title}`);
      } else {
        console.log(`❌ BUILD: Post not found for slug: ${slug}`);
        console.log(`📋 BUILD: Available slugs:`, publishedPosts.map((p: BlogPost) => p.slug).slice(0, 10));
      }
    }
    
    return post || null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ BUILD: Error fetching content by slug:', error);
    }
    return null;
  }
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const posts = await getAllContent();
    return posts.filter(post => post.categories.includes(category));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching posts by category:', error);
    }
    return [];
  }
}

// Helper function to normalize text for better matching
function normalizeText(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

// Helper function to calculate similarity score between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = normalizeText(str1).split(' ');
  const words2 = normalizeText(str2).split(' ');
  
  let matches = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1.includes(word2) || word2.includes(word1)) {
        matches++;
        break;
      }
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
}

// Enhanced search function with proper error handling
export async function searchPosts(query: string): Promise<SearchResult> {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 SEARCH DEBUG: Starting search with query:', query);
  }
  
  try {
    const posts = await getAllContent();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📚 SEARCH DEBUG: Fetched posts from API:', posts.length, 'posts');
      
      // Log first few post titles for verification
      if (posts.length > 0) {
        console.log('📝 SEARCH DEBUG: Sample post titles:', posts.slice(0, 3).map((p: BlogPost) => p.title));
      }
    }
    
    if (!query.trim()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ SEARCH DEBUG: Empty query, returning all posts');
      }
      return {
        posts,
        hasError: false
      };
    }
    
    const normalizedQuery = normalizeText(query);
    const searchTerms = normalizedQuery.split(' ').filter(term => term.length > 0);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔤 SEARCH DEBUG: Original query:', query);
      console.log('🔤 SEARCH DEBUG: Normalized query:', normalizedQuery);
      console.log('🔤 SEARCH DEBUG: Search terms:', searchTerms);
    }
    
    // Score each post based on relevance
    const scoredPosts = posts.map(post => {
      let score = 0;
      const normalizedTitle = normalizeText(post.title);
      const normalizedDescription = normalizeText(post.metaDescription);
      const normalizedContent = normalizeText(post.content);
      const normalizedTags = post.tags.map(tag => normalizeText(tag));
      const normalizedCategories = post.categories.map(cat => normalizeText(cat));
      
      // Exact phrase matches (highest priority)
      if (normalizedTitle.includes(normalizedQuery)) score += 100;
      if (normalizedDescription.includes(normalizedQuery)) score += 80;
      if (normalizedContent.includes(normalizedQuery)) score += 40;
      
      // Individual keyword matches
      for (const term of searchTerms) {
        if (term.length < 2) continue; // Skip very short terms
        
        // Title matches (high priority)
        if (normalizedTitle.includes(term)) score += 20;
        
        // Description matches
        if (normalizedDescription.includes(term)) score += 15;
        
        // Tag exact matches
        if (normalizedTags.some(tag => tag === term)) score += 25;
        
        // Tag partial matches
        if (normalizedTags.some(tag => tag.includes(term))) score += 15;
        
        // Category exact matches
        if (normalizedCategories.some(cat => cat === term)) score += 25;
        
        // Category partial matches
        if (normalizedCategories.some(cat => cat.includes(term))) score += 15;
        
        // Content matches (lower priority)
        const contentMatches = (normalizedContent.match(new RegExp(term, 'g')) || []).length;
        score += Math.min(contentMatches * 2, 10); // Cap content score
      }
      
      // Fuzzy matching for title and description
      const titleSimilarity = calculateSimilarity(normalizedQuery, normalizedTitle);
      const descriptionSimilarity = calculateSimilarity(normalizedQuery, normalizedDescription);
      
      if (titleSimilarity > 0.3) score += titleSimilarity * 30;
      if (descriptionSimilarity > 0.3) score += descriptionSimilarity * 20;
      
      // Bonus for multiple term matches
      const matchingTerms = searchTerms.filter(term => 
        normalizedTitle.includes(term) || 
        normalizedDescription.includes(term) || 
        normalizedTags.some(tag => tag.includes(term)) ||
        normalizedCategories.some(cat => cat.includes(term))
      );
      
      if (matchingTerms.length > 1) {
        score += matchingTerms.length * 10;
      }
      
      return { post, score, normalizedTitle, normalizedDescription };
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 SEARCH DEBUG: Scored posts sample:');
      scoredPosts.slice(0, 5).forEach(({ post, score, normalizedTitle }) => {
        console.log(`  - "${post.title}" (normalized: "${normalizedTitle}") - Score: ${score}`);
      });
    }
    
    // Filter posts with score > 0 and sort by score (descending)
    const filteredPosts = scoredPosts
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ post }) => post);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ SEARCH DEBUG: Final filtered posts count:', filteredPosts.length);
      
      if (filteredPosts.length === 0) {
        console.log('❌ SEARCH DEBUG: No posts found! Showing top 5 scores for debugging:');
        const topScores = scoredPosts
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        
        topScores.forEach(({ post, score, normalizedTitle, normalizedDescription }) => {
          console.log(`  - "${post.title}"`);
          console.log(`    Normalized title: "${normalizedTitle}"`);
          console.log(`    Normalized description: "${normalizedDescription}"`);
          console.log(`    Score: ${score}`);
          console.log(`    Categories: ${post.categories.join(', ')}`);
          console.log(`    Tags: ${post.tags.join(', ')}`);
          console.log('    ---');
        });
      } else {
        console.log('🎯 SEARCH DEBUG: Top 3 results:');
        filteredPosts.slice(0, 3).forEach((post, index) => {
          console.log(`  ${index + 1}. "${post.title}"`);
        });
      }
    }
    
    return {
      posts: filteredPosts,
      hasError: false
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ SEARCH DEBUG: Error in searchPosts:', error);
    }
    return {
      posts: [],
      hasError: true,
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Legacy function for backward compatibility - will be removed in future versions
export async function searchPostsLegacy(query: string): Promise<BlogPost[]> {
  const result = await searchPosts(query);
  return result.posts;
}
