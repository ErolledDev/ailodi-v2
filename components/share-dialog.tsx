'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SocialShareButtons } from '@/components/social-share-buttons';
import type { BlogPost } from '@/types/blog';

interface ShareDialogProps {
  post: BlogPost;
  url: string;
  children?: React.ReactNode;
  variant?: 'ghost' | 'default' | 'destructive' | 'outline' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ShareDialog({ 
  post, 
  url, 
  children, 
  variant = 'ghost',
  size = 'sm',
  className = ''
}: ShareDialogProps) {
  const [open, setOpen] = useState(false);

  // If children are provided, use them as the trigger
  // Otherwise, render a default share button
  const trigger = children || (
    <Button
      variant={variant}
      size={size}
      className={`text-muted-foreground ${className}`}
      aria-label="Share post"
    >
      <Share2 size={16} />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">Share this article</DialogTitle>
          <DialogDescription className="text-base">
            Share "{post.title}" with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <SocialShareButtons post={post} url={url} />
        </div>
      </DialogContent>
    </Dialog>
  );
}