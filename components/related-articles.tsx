'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { BlogPost } from '@/types/blog';

interface RelatedArticlesProps {
  currentPostId?: string;
  categories?: string[];
}

export function RelatedArticles({ currentPostId, categories = [] }: RelatedArticlesProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        const response = await fetch('https://blogform.netlify.app/api/content.json');
        const data = await response.json();
        
        let filteredPosts = data.filter((post: BlogPost) => 
          post.status === 'published' && post.id !== currentPostId
        );

        // If categories are provided, prioritize posts with matching categories
        if (categories.length > 0) {
          const relatedPosts = filteredPosts.filter((post: BlogPost) =>
            post.categories.some(category => categories.includes(category))
          );
          
          const otherPosts = filteredPosts.filter((post: BlogPost) =>
            !post.categories.some(category => categories.includes(category))
          );
          
          filteredPosts = [...relatedPosts, ...otherPosts];
        }

        // Sort by publish date and take first 6
        const sortedPosts = filteredPosts
          .sort((a: BlogPost, b: BlogPost) => 
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
          )
          .slice(0, 6);

        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedPosts();
  }, [currentPostId, categories]);

  if (loading) {
    return (
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <TrendingUp size={16} className="text-primary" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">Related Articles</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-5 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <TrendingUp size={16} className="text-primary" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">Related Articles</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.slug}`} className="group">
            <Card className="overflow-hidden border border-border/50 transition-all duration-200 hover:shadow-lg hover:border-primary/20">
              <CardContent className="p-0">
                {/* Featured Image */}
                {post.featuredImageUrl && (
                  <div className="w-full h-48 overflow-hidden">
                    <Image
                      src={post.featuredImageUrl}
                      alt={post.title}
                      width={400}
                      height={192}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Category Badge */}
                  {post.categories.length > 0 && (
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {post.categories[0]}
                      </span>
                    </div>
                  )}
                  
                  {/* Title */}
                  <h4 className="font-semibold text-foreground text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.metaDescription}
                  </p>
                  
                  {/* Meta Information */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/30">
                    <span>{format(new Date(post.publishDate), 'MMM d, yyyy')}</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}