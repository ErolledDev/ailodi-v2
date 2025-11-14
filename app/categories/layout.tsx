import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories | AI Lodi - Tech Insights & AI Innovation',
  description: 'Browse all categories on AI Lodi to discover articles organized by topics and areas of interest in AI, programming, automation, and future science.',
  keywords: [
    'categories',
    'tech topics',
    'AI categories',
    'programming topics',
    'technology categories',
    'AI Lodi',
    'tech blog',
    'artificial intelligence',
    'future science',
    'automation'
  ],
  openGraph: {
    title: 'Categories | AI Lodi',
    description: 'Browse all categories to discover articles organized by topics and areas of interest in technology.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/categories`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Categories | AI Lodi',
    description: 'Browse all categories to discover articles organized by topics and areas of interest in technology.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/categories`,
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}