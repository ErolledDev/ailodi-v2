'use client';

import { Twitter, Facebook, Linkedin, Share2, Copy, Check, MessageCircle, Send, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import type { BlogPost } from '@/types/blog';

interface SocialShareButtonsProps {
  post: BlogPost;
  url: string;
}

export function SocialShareButtons({ post, url }: SocialShareButtonsProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const shareOnTwitter = () => {
    const text = `${post.title} - ${post.metaDescription}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=AI,Tech,Innovation`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const shareOnReddit = () => {
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(post.title)}`;
    window.open(redditUrl, '_blank', 'width=600,height=400');
  };

  const shareOnPinterest = () => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(post.title + ' - ' + post.metaDescription)}&media=${encodeURIComponent(post.featuredImageUrl || '')}`;
    window.open(pinterestUrl, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(post.title + ' - ' + url)}`;
    window.open(whatsappUrl, '_blank', 'width=600,height=400');
  };

  const shareOnTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`;
    window.open(telegramUrl, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this article: ${post.title}`);
    const body = encodeURIComponent(`I thought you might find this interesting:\n\n${post.title}\n${post.metaDescription}\n\nRead more: ${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(`Check out this article: ${post.title} - ${url}`);
    window.location.href = `sms:?body=${message}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: shareOnTwitter,
      className: 'w-10 h-10 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-full flex items-center justify-center transition-all duration-200',
      ariaLabel: 'Share on Twitter'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: shareOnFacebook,
      className: 'w-10 h-10 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-full flex items-center justify-center transition-all duration-200',
      ariaLabel: 'Share on Facebook'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: shareOnLinkedIn,
      className: 'w-10 h-10 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-full flex items-center justify-center transition-all duration-200',
      ariaLabel: 'Share on LinkedIn'
    },
    {
      name: 'Reddit',
      icon: MessageCircle,
      onClick: shareOnReddit,
      className: 'w-10 h-10 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-full flex items-center justify-center transition-all duration-200',
      ariaLabel: 'Share on Reddit'
    },
    {
      name: 'Pinterest',
      icon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.999-5.373 11.999-12C24 5.372 18.626.001 12.001.001z"/>
        </svg>
      ),
      onClick: shareOnPinterest,
      className: 'w-10 h-10 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-full flex items-center justify-center transition-all duration-200',
      ariaLabel: 'Share on Pinterest'
    },
    {
      name: 'WhatsApp',
      icon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.108"/>
        </svg>
      ),
      onClick: shareOnWhatsApp,
      className: 'w-10 h-10 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-full flex items-center justify-center transition-all duration-200',
      ariaLabel: 'Share on WhatsApp'
    },
    {
      name: 'Telegram',
      icon: Send,
      onClick: shareOnTelegram,
      className: 'w-10 h-10 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-full flex items-center justify-center transition-all duration-200',
      ariaLabel: 'Share on Telegram'
    },
    {
      name: 'Email',
      icon: Mail,
      onClick: shareViaEmail,
      className: 'w-10 h-10 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-full flex items-center justify-center transition-all duration-200',
      ariaLabel: 'Share via Email'
    },
    {
      name: 'SMS',
      icon: Phone,
      onClick: shareViaSMS,
      className: 'w-10 h-10 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border border-border rounded-full flex items-center justify-center transition-all duration-200',
      ariaLabel: 'Share via SMS'
    }
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mt-8 p-4 sm:p-6 bg-muted/30 rounded-xl border border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Share2 size={16} className="text-primary" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Share this article</h3>
      </div>
      
      {/* Social Media Buttons - Responsive Grid */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {shareButtons.map((button) => {
          const IconComponent = button.icon;
          return (
            <button
              key={button.name}
              onClick={button.onClick}
              className={button.className}
              aria-label={button.ariaLabel}
              title={button.name}
            >
              <IconComponent size={18} />
            </button>
          );
        })}
      </div>

      {/* Copy Link Section */}
      <div className="space-y-3 pt-4 border-t border-border/50">
        <h4 className="text-sm font-medium text-muted-foreground">Or copy link</h4>
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 bg-transparent text-sm text-muted-foreground outline-none min-w-0"
          />
          <button
            onClick={copyToClipboard}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-xs ${
              copySuccess 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-background hover:bg-muted text-foreground border border-border hover:border-primary'
            }`}
            aria-label="Copy link"
          >
            {copySuccess ? (
              <>
                <Check size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Help others discover this AI & tech insight by sharing it with your network
      </p>
    </div>
  );
}
