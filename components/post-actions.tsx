'use client';

import { useState } from 'react';
import { BookmarkPlus, Bookmark, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareDialog } from '@/components/share-dialog';
import type { BlogPost } from '@/types/blog';

interface PostActionsProps {
  post: BlogPost;
  url: string;
}

export function PostActions({ post, url }: PostActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to localStorage or send to your backend
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (!isBookmarked) {
      bookmarks.push(post.id);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } else {
      const filtered = bookmarks.filter((id: string) => id !== post.id);
      localStorage.setItem('bookmarks', JSON.stringify(filtered));
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically send to your backend
  };

  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Like Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`text-muted-foreground ${isLiked ? 'text-red-500' : ''}`}
        aria-label={isLiked ? `Unlike this article: ${post.title}` : `Like this article: ${post.title}`}
        title={isLiked ? 'Unlike this article' : 'Like this article'}
      >
        <Heart size={20} className={isLiked ? 'fill-current' : ''} />
      </Button>

      {/* Bookmark Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className="text-muted-foreground"
        aria-label={isBookmarked ? `Remove bookmark from article: ${post.title}` : `Bookmark this article: ${post.title}`}
        title={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
      >
        {isBookmarked ? (
          <Bookmark size={20} className="fill-current" />
        ) : (
          <BookmarkPlus size={20} />
        )}
      </Button>

      {/* Share Dialog */}
      <ShareDialog post={post} url={url} />

      {/* Open in New Tab */}
      <Button
        variant="ghost"
        size="sm"
        onClick={openInNewTab}
        className="text-muted-foreground"
        aria-label={`Open article "${post.title}" in a new tab`}
        title="Open in new tab"
      >
        <ExternalLink size={20} />
      </Button>
    </div>
  );
}