'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedBlogCard } from '@/components/enhanced-blog-card';
import { searchPosts, getAllContent } from '@/lib/content';
import type { BlogPost } from '@/types/blog';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update document title based on search query
  useEffect(() => {
    if (query) {
      document.title = `Search Results for "${query}" | AI Lodi - Tech Insights & AI Innovation`;
    } else {
      document.title = 'Search AI Lodi - Discover Tech Insights';
    }
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setHasError(false);
      setErrorMessage('');
      
      if (query) {
        // Search for posts matching the query
        const searchResult = await searchPosts(query);
        
        if (searchResult.hasError) {
          setHasError(true);
          setErrorMessage(searchResult.errorMessage || 'Failed to fetch search results');
          setPosts([]);
        } else {
          setPosts(searchResult.posts);
        }
      } else {
        // If no query, show all posts
        const allPosts = await getAllContent();
        setPosts(allPosts);
      }
    } catch (error) {
      console.error('Error in search page:', error);
      setHasError(true);
      setErrorMessage('An unexpected error occurred while searching');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  const handleRetry = () => {
    fetchSearchResults();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          {query ? `Search Results for "${query}"` : 'Search AI Lodi'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {query 
            ? hasError 
              ? 'We encountered an issue while searching. Please try again.'
              : `Found ${posts.length} ${posts.length === 1 ? 'article' : 'articles'} matching your search`
            : 'Use the search bar above to discover insights on AI, programming, automation, and future science'
          }
        </p>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border/50 rounded-xl p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded mb-4 w-1/4" />
                  <div className="h-8 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Search Error
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              We're having trouble connecting to our content service. This might be a temporary issue.
            </p>
            <div className="space-y-4">
              <Button
                onClick={handleRetry}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </Button>
              <p className="text-sm text-muted-foreground">
                Error details: {errorMessage}
              </p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {query ? 'No results found' : 'Start your search'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              {query 
                ? `We couldn't find any articles matching "${query}". Try different keywords or explore our suggested topics below.`
                : 'Use the search bar above to find articles on AI, programming, and technology trends.'
              }
            </p>
            {query && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['AI', 'Machine Learning', 'Programming', 'Automation', 'Quantum Computing'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
                      }}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results summary */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pb-4 border-b border-border/50">
              <Clock size={14} />
              <span>
                {posts.length} {posts.length === 1 ? 'result' : 'results'} 
                {query && ` for "${query}"`}
              </span>
            </div>

            {/* Results list */}
            {posts.map((post, index) => (
              <EnhancedBlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchPageLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Search AI Lodi</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Loading search results...
        </p>
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card border border-border/50 rounded-xl p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded mb-4 w-1/4" />
              <div className="h-8 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  );
}