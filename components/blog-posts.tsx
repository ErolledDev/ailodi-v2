'use client';

import { useState } from 'react';
import { RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EnhancedBlogCard } from '@/components/enhanced-blog-card';
import type { BlogPost } from '@/types/blog';

const POSTS_PER_LOAD = 5;

interface BlogPostsProps {
  initialPosts: BlogPost[];
  allPosts: BlogPost[];
}

export function BlogPosts({ initialPosts, allPosts }: BlogPostsProps) {
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>(initialPosts);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Extract unique categories from all posts
  const categories = Array.from(new Set(allPosts.flatMap(post => post.categories)));

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    let filteredPosts = allPosts;
    if (category !== 'all') {
      filteredPosts = allPosts.filter(post => post.categories.includes(category));
    }
    
    setDisplayedPosts(filteredPosts.slice(0, POSTS_PER_LOAD));
  };

  const loadMore = async () => {
    setLoadingMore(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredPosts = allPosts;
    if (selectedCategory !== 'all') {
      filteredPosts = allPosts.filter(post => post.categories.includes(selectedCategory));
    }
    
    const currentCount = displayedPosts.length;
    const nextPosts = filteredPosts.slice(currentCount, currentCount + POSTS_PER_LOAD);
    setDisplayedPosts(prev => [...prev, ...nextPosts]);
    setLoadingMore(false);
  };

  const getFilteredPostsCount = () => {
    if (selectedCategory === 'all') return allPosts.length;
    return allPosts.filter(post => post.categories.includes(selectedCategory)).length;
  };

  const hasMorePosts = displayedPosts.length < getFilteredPostsCount();

  return (
    <section className="py-16 bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">All Articles</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of tech insights and analysis. 
            {selectedCategory !== 'all' && ` Filtered by ${selectedCategory}.`}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-48 border-border focus:ring-primary focus:border-primary">
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {displayedPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No articles found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {displayedPosts.map((post, index) => (
                <EnhancedBlogCard key={post.id} post={post} index={index} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMorePosts && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw size={18} className="mr-2 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    <>
                      Load More Articles
                      <span className="ml-2 text-sm opacity-80">
                        ({getFilteredPostsCount() - displayedPosts.length} remaining)
                      </span>
                    </>
                  )}
                </Button>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Showing {displayedPosts.length} of {getFilteredPostsCount()} articles
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}