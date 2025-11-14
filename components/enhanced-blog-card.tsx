'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock, Share2 } from 'lucide-react';
import { ShareDialog } from '@/components/share-dialog';
import type { BlogPost } from '@/types/blog';

interface EnhancedBlogCardProps {
  post: BlogPost;
  index?: number;
}

export function EnhancedBlogCard({ post, index = 0 }: EnhancedBlogCardProps) {
  const readingTime = Math.ceil(post.content.split(' ').length / 200);
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/post/${post.slug}`;

  const getAuthorInitials = () => {
    return post.author
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Use Pexels image for consistent avatar
  const getAuthorAvatar = () => {
    return 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face';
  };

  return (
    <article 
      className="relative bg-card border border-border/50 rounded-xl p-4 sm:p-6 shadow-sm"
      role="article"
      aria-labelledby={`post-title-${post.id}`}
    >
      <Link href={`/post/${post.slug}`} className="block">
        <div className="space-y-4">
          {/* Author and Meta Info */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
              <Image
                src={getAuthorAvatar()}
                alt={`${post.author}'s avatar`}
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium text-foreground">{post.author}</span>
            <span>·</span>
            <time dateTime={post.publishDate}>
              {format(new Date(post.publishDate), 'MMM d')}
            </time>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{readingTime} min read</span>
            </div>
          </div>
          
          <div className="flex items-start gap-6">
            <div className="flex-1 space-y-3">
              <h2 
                id={`post-title-${post.id}`}
                className="text-xl md:text-2xl font-bold text-foreground leading-tight line-clamp-2"
              >
                {post.title}
              </h2>
              
              <p className="text-muted-foreground leading-relaxed line-clamp-3 text-base">
                {post.metaDescription}
              </p>
              
              <div className="flex items-center gap-2">
                {post.categories.slice(0, 2).map((category) => (
                  <span 
                    key={category} 
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {category}
                  </span>
                ))}
                {post.categories.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{post.categories.length - 2} more
                  </span>
                )}
              </div>
            </div>
            
            {post.featuredImageUrl && (
              <div className="w-32 h-32 md:w-40 md:h-32 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={post.featuredImageUrl}
                  alt={post.title}
                  width={160}
                  height={128}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 128px, 160px"
                />
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Share Button - Moved to right side */}
      <div className="flex justify-end mt-4 pt-4 border-t border-border/50">
        <div onClick={(e) => e.stopPropagation()}>
          <ShareDialog post={post} url={postUrl}>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-muted-foreground"
              aria-label="Share post"
            >
              <Share2 size={16} />
            </button>
          </ShareDialog>
        </div>
      </div>
    </article>
  );
}
