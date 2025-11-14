'use client';

import { useEffect, useRef } from 'react';
import { MessageSquare, Users, Clock } from 'lucide-react';

interface ValineCommentsProps {
  path: string;
  title?: string;
}

declare global {
  interface Window {
    Valine: any;
  }
}

export function ValineComments({ path, title }: ValineCommentsProps) {
  const valineRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Check if environment variables are available
    const appId = process.env.NEXT_PUBLIC_VALINE_APP_ID;
    const appKey = process.env.NEXT_PUBLIC_VALINE_APP_KEY;
    const serverURLs = process.env.NEXT_PUBLIC_VALINE_SERVER_URLS;

    if (!appId || !appKey) {
      console.warn('Valine: Missing APP_ID or APP_KEY environment variables');
      return;
    }

    // Function to initialize Valine
    const initValine = () => {
      if (window.Valine && valineRef.current) {
        new window.Valine({
          el: valineRef.current,
          appId: appId,
          appKey: appKey,
          serverURLs: serverURLs || undefined,
          path: path,
          placeholder: 'Share your thoughts about this article...',
          avatar: 'retro',
          visitor: true,
          highlight: true,
          recordIP: false,
          enableQQ: false,
          requiredFields: ['nick', 'mail'],
          meta: ['nick', 'mail'],
          pageSize: 10,
          lang: 'en',
          emojiCDN: '//i0.hdslb.com/bfs/emote/',
          emojiMaps: {
            "tv_doge": "6ea59c827c414b4a2955fe79e0f6fd3dcd515e24.png",
            "tv_親親": "a8111ad55953ef5e3be3327ef94eb4a39d535d06.png",
            "tv_偷笑": "bb690d4107620f1c15cff29509db529a73aee261.png",
            "tv_再見": "180129b8ea851044ce71caf55cc8ce44bd4a4fc8.png",
            "tv_冷漠": "b9cbc755c2b3ee43be07ca13de84e5b699a3a101.png",
            "tv_發怒": "34ba3cd204d5b05fec70ce08fa9fa0dd612409ff.png",
            "tv_發財": "34db290afd2963723c6eb3c4560667db7253a21a.png",
            "tv_可愛": "9e55fd9b500ac4b96613539f1ce2f9499e314ed9.png",
            "tv_呆": "fe1179ebaa191569b0d31cecafe7a2cd1c951c9d.png",
            "tv_嗑瓜子": "37560a9f0b9a4b95e8e9e4b4e1e9e4b95e8e9e4b.png"
          }
        });
      }
    };

    // Check if Valine is already loaded
    if (window.Valine) {
      initValine();
      return;
    }

    // Create and load Valine script
    const script = document.createElement('script');
    script.src = '//unpkg.com/valine/dist/Valine.min.js';
    script.async = true;
    script.onload = initValine;
    script.onerror = () => {
      console.error('Failed to load Valine script');
    };

    document.head.appendChild(script);
    scriptRef.current = script;

    // Cleanup function
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [path, title]);

  return (
    <div className="mt-12 pt-8 border-t border-border">
      {/* Comments Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageSquare size={16} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Comments</h3>
        </div>
        <p className="text-muted-foreground">
          Join the discussion and share your thoughts about this article. 
          Your feedback helps us create better content for the tech community.
        </p>
      </div>

      {/* Valine Comments Container */}
      <div 
        ref={valineRef} 
        id="valine-comments"
        className="valine-container"
      />

    </div>
  );
}
