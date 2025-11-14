import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Suspense } from 'react';
import { ThemeProvider } from 'next-themes';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { PageProgressBar } from '@/components/page-progress-bar';
import { GoogleAnalytics } from '@/components/google-analytics';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'),
  title: {
    default: 'AI Lodi - Your Global Tech Insights & AI Innovation Hub | Latest AI Trends',
    template: '%s | AI Lodi - Tech Insights & AI Innovation'
  },
  description: 'AI Lodi is your ultimate guide to modern technology, AI breakthroughs, programming trends, and future science. Get in-depth analysis, tutorials, and insights on cutting-edge tech innovations shaping our world in 2025.',
  keywords: [
    'AI', 
    'artificial intelligence', 
    'machine learning', 
    'programming', 
    'web development', 
    'technology trends 2025', 
    'automation', 
    'quantum computing', 
    'deep tech',
    'generative AI',
    'developer tools',
    'tech insights',
    'future science',
    'innovation',
    'tech news',
    'AI research',
    'coding tutorials',
    'tech analysis',
    'ChatGPT',
    'OpenAI',
    'neural networks',
    'data science',
    'cloud computing',
    'cybersecurity',
    'blockchain',
    'IoT',
    'robotics',
    'AR VR',
    'tech careers'
  ],
  authors: [{ name: 'AI Lodi Team', url: 'https://ailodi.xyz/about' }],
  creator: 'AI Lodi',
  publisher: 'AI Lodi',
  category: 'Technology',
  classification: 'Technology Blog',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz',
    title: 'AI Lodi - Your Global Tech Insights & AI Innovation Hub | Latest AI Trends',
    description: 'AI Lodi is your ultimate guide to modern technology, AI breakthroughs, programming trends, and future science. Get in-depth analysis, tutorials, and insights on cutting-edge tech innovations.',
    siteName: 'AI Lodi',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Lodi - Global Tech Insights and AI Innovation Hub',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'AI Lodi - Tech Innovation Square Logo',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Lodi - Your Global Tech Insights & AI Innovation Hub',
    description: 'AI Lodi is your ultimate guide to modern technology, AI breakthroughs, programming trends, and future science. Get in-depth analysis, tutorials, and insights on cutting-edge tech innovations.',
    creator: '@ailodi_tech',
    site: '@ailodi_tech',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GA_ID || 'G-XQZ074X48F',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz',
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'AI Lodi RSS Feed' },
      ],
    },
  },
  other: {
    'theme-color': '#22c55e',
    'color-scheme': 'light dark',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'AI Lodi',
    'application-name': 'AI Lodi',
    'msapplication-TileColor': '#22c55e',
    'msapplication-config': '/browserconfig.xml',
  },
};

function GoogleAnalyticsWrapper({ gaId }: { gaId: string }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalytics gaId={gaId} />
    </Suspense>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get GA ID from environment variable
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="preconnect" href="https://api.dicebear.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://blogform.netlify.app" />
        
        {/* Google Analytics - Always include if GA ID is available */}
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                    send_page_view: true,
                    anonymize_ip: true,
                    allow_google_signals: false,
                    allow_ad_personalization_signals: false
                  });
                `,
              }}
            />
          </>
        )}
        
        {/* Enhanced Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AI Lodi",
              "alternateName": "AI Lodi Tech",
              "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz',
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/logo.png`,
                "width": 512,
                "height": 512
              },
              "description": "AI Lodi is your ultimate guide to modern technology, AI breakthroughs, programming trends, and future science. Get in-depth analysis, tutorials, and insights on cutting-edge tech innovations.",
              "foundingDate": "2024",
              "sameAs": [
                "https://twitter.com/ailodi_tech",
                "https://linkedin.com/company/ailodi",
                "https://github.com/ailodi",
                "https://youtube.com/@ailodi"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "hello@ailodi.xyz",
                "availableLanguage": "English"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Global"
              },
              "areaServed": "Worldwide",
              "knowsAbout": [
                "Artificial Intelligence",
                "Machine Learning",
                "Programming",
                "Web Development",
                "Technology Trends",
                "Automation",
                "Quantum Computing",
                "Future Science"
              ]
            })
          }}
        />
        
        {/* Enhanced Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AI Lodi",
              "alternateName": "AI Lodi Tech Insights",
              "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz',
              "description": "AI Lodi is your ultimate guide to modern technology, AI breakthroughs, programming trends, and future science. Get in-depth analysis, tutorials, and insights on cutting-edge tech innovations.",
              "inLanguage": "en-US",
              "isAccessibleForFree": true,
              "publisher": {
                "@type": "Organization",
                "name": "AI Lodi",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/logo.png`
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "Blog",
                "name": "AI Lodi Blog",
                "description": "Latest insights on AI, technology trends, programming, and future science",
                "blogPost": {
                  "@type": "BlogPosting",
                  "headline": "Latest AI and Technology Insights"
                }
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium focus:shadow-lg"
        >
          Skip to main content
        </a>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PageProgressBar />
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          
          {/* Google Analytics Page View Tracking Component - Wrapped in Suspense */}
          {gaId && <GoogleAnalyticsWrapper gaId={gaId} />}
          
          {/* Toast Notifications */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
