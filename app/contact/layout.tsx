import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact AI Lodi - Get In Touch',
  description: 'Have questions, insights to share, or want to collaborate? Contact AI Lodi for inquiries about AI, tech trends, partnerships, and content contributions.',
  keywords: [
    'contact us', 
    'AI Lodi contact', 
    'tech collaboration', 
    'submit article', 
    'tech inquiries',
    'partnership',
    'guest posting',
    'tech community',
    'AI insights',
    'content contribution'
  ],
  openGraph: {
    title: 'Contact AI Lodi - Get In Touch',
    description: 'Connect with AI Lodi for tech insights, collaboration opportunities, and to join our global community of innovators.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact AI Lodi - Get In Touch',
    description: 'Connect with AI Lodi for tech insights, collaboration opportunities, and to join our global community of innovators.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}