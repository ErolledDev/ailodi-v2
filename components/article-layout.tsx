'use client';

import { format } from 'date-fns';
import { Clock, Calendar, User, Tag, Eye } from 'lucide-react';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { SocialShareButtons } from '@/components/social-share-buttons';
import { PostActions } from '@/components/post-actions';
import { AuthorCard } from '@/components/author-card';
import { SubscribeForm } from '@/components/subscribe-form';
import { RelatedArticles } from '@/components/related-articles';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';

interface ArticleLayoutProps {
  post: BlogPost;
  currentUrl: string;
}

export function ArticleLayout({ post, currentUrl }: ArticleLayoutProps) {
  const publishDate = new Date(post.publishDate);
  const updatedDate = new Date(post.updatedAt);
  const readingTime = Math.ceil(post.content.split(' ').length / 200);
  const wordCount = post.content.split(' ').length;

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
    <article className="max-w-none lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
      <div>
        {/* Header */}
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-6 sm:mb-8">
            {post.title}
          </h1>
          
          {/* Meta Description */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary rounded-r-lg p-4 sm:p-6 mb-6 sm:mb-8 lg:mb-10">
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed italic">
              {post.metaDescription}
            </p>
          </div>
          
          {/* Enhanced Article Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Image
                  src={getAuthorAvatar()}
                  alt={`${post.author}'s avatar`}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-foreground text-base sm:text-lg flex items-center gap-2">
                  <User size={14} />
                  {post.author}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <time dateTime={post.publishDate}>
                      Published {format(publishDate, 'MMMM d, yyyy')}
                    </time>
                  </div>
                  {post.updatedAt !== post.publishDate && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <time dateTime={post.updatedAt}>
                        Updated {format(updatedDate, 'MMMM d, yyyy')}
                      </time>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{wordCount} words</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <PostActions post={post} url={currentUrl} />
            </div>
          </div>

          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 lg:mb-10">
              {post.categories.map((category) => (
                <Link
                  key={category}
                  href={`/categories?filter=${encodeURIComponent(category)}`}
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Tag size={12} className="mr-1" />
                  {category}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
              <Image
                src={post.featuredImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8 sm:mb-10 lg:mb-12">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Social Sharing */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <SocialShareButtons post={post} url={currentUrl} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-8 sm:mb-10 lg:mb-12 pt-6 sm:pt-8 border-t border-border">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Tags</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {post.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Author Bio */}
        <div className="mb-6 sm:mb-8 lg:mb-10 pt-6 sm:pt-8 border-t border-border">
          <AuthorCard
            author={post.author}
            avatar={getAuthorAvatar()}
            socialLinks={{
              twitter: "https://twitter.com/ailodi_tech",
              linkedin: "https://linkedin.com/company/ailodi",
              website: "https://ailodi.tech"
            }}
          />
        </div>

        {/* Newsletter Subscription */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <SubscribeForm />
        </div>

        {/* Related Articles - Always shown below main content */}
        <RelatedArticles 
          currentPostId={post.id} 
          categories={post.categories} 
        />
      </div>
    </article>
  );
}
