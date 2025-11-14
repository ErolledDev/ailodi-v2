import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search AI Lodi - Discover Tech Insights',
  description: 'Search AI Lodi for in-depth articles, tutorials, and news on artificial intelligence, programming, automation, and future science. Find exactly what you\'re looking for.',
  keywords: [
    'search',
    'AI Lodi search',
    'tech search',
    'find articles',
    'AI search',
    'programming search',
    'technology search',
    'discover content',
    'tech insights'
  ],
  openGraph: {
    title: 'Search AI Lodi - Discover Tech Insights',
    description: 'Search for in-depth articles, tutorials, and news on artificial intelligence, programming, and future science.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/search`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search AI Lodi - Discover Tech Insights',
    description: 'Search for in-depth articles, tutorials, and news on artificial intelligence, programming, and future science.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/search`,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}