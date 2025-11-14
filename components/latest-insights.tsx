'use client';

import { Zap } from 'lucide-react';
import { EnhancedBlogCard } from '@/components/enhanced-blog-card';
import type { BlogPost } from '@/types/blog';

interface LatestInsightsProps {
  posts: BlogPost[];
}

export function LatestInsights({ posts }: LatestInsightsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="featured" className="py-16 bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Zap size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary">Latest Insights</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Fresh Tech Insights</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest articles on AI breakthroughs, programming trends, and future science.
          </p>
        </div>
        
        <div className="space-y-8">
          {posts.map((post, index) => (
            <EnhancedBlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}