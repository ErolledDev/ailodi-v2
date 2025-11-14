import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/article-layout';
import { SponsorSection } from '@/components/sponsor-section';
import { ValineComments } from '@/components/valine-comments';
import { getContentBySlug, getAllContent } from '@/lib/content';
import type { Metadata } from 'next';
import type { BlogPost } from '@/types/blog';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    console.log('🏗️ BUILD: Starting generateStaticParams with enhanced cache busting...');
    
    // Force fresh data fetch during build time with enhanced cache busting
    const posts = await getAllContent();
    console.log(`🏗️ BUILD: Generating static params for ${posts.length} posts`);
    
    const params = posts.map((post) => ({
      slug: post.slug,
    }));
    
    console.log('🏗️ BUILD: Generated slugs:', params.map(p => p.slug).slice(0, 5), '...');
    console.log('🏗️ BUILD: Total static params generated:', params.length);
    
    return params;
  } catch (error) {
    console.error('❌ BUILD: Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const post = await getContentBySlug(params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found | AI Lodi',
        description: 'The requested blog post could not be found.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz';
    const postUrl = `${baseUrl}/post/${post.slug}`;
    const readingTime = Math.ceil(post.content.split(' ').length / 200);

    return {
      title: post.seoTitle || `${post.title} | AI Lodi`,
      description: post.metaDescription,
      keywords: post.keywords?.join(', '),
      authors: [{ name: post.author, url: `${baseUrl}/author/${encodeURIComponent(post.author.toLowerCase().replace(/\s+/g, '-'))}` }],
      creator: post.author,
      publisher: 'AI Lodi',
      category: post.categories[0] || 'Technology',
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.seoTitle || post.title,
        description: post.metaDescription,
        type: 'article',
        publishedTime: post.publishDate,
        modifiedTime: post.updatedAt,
        authors: [post.author],
        section: post.categories[0] || 'Technology',
        tags: post.tags,
        images: post.featuredImageUrl ? [{
          url: post.featuredImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/jpeg',
        }] : [{
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/jpeg',
        }],
        url: postUrl,
        siteName: 'AI Lodi',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seoTitle || post.title,
        description: post.metaDescription,
        images: post.featuredImageUrl ? [post.featuredImageUrl] : [`${baseUrl}/og-image.jpg`],
        creator: '@ailodi_tech',
        site: '@ailodi_tech',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'article:reading_time': readingTime.toString(),
        'article:word_count': post.content.split(' ').length.toString(),
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found | AI Lodi',
      description: 'The requested blog post could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  let post: BlogPost | null;
  
  try {
    post = await getContentBySlug(params.slug);
  } catch (error) {
    console.error('❌ BUILD: Error fetching post:', error);
    notFound();
  }

  if (!post || post.status !== 'published') {
    console.log(`❌ BUILD: Post not found or not published for slug: ${params.slug}`);
    notFound();
  }

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/post/${post.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 xl:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <ArticleLayout post={post} currentUrl={currentUrl} />
            
            {/* Valine Comments Section */}
            <ValineComments 
              path={`/post/${post.slug}`}
              title={post.title}
            />
          </div>

          {/* Sidebar - Hidden on mobile, visible on large screens */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-20 space-y-6 sm:space-y-8">
              {/* Sponsor Section */}
              <SponsorSection />
            </div>
          </aside>
        </div>

        {/* Mobile-only sponsor section - Shown below comments on small screens */}
        <div className="lg:hidden mt-8 sm:mt-10">
          <SponsorSection />
        </div>
      </div>

      {/* Enhanced Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.metaDescription,
            "image": post.featuredImageUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/og-image.jpg`,
            "author": {
              "@type": "Person",
              "name": post.author,
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/author/${encodeURIComponent(post.author.toLowerCase().replace(/\s+/g, '-'))}`
            },
            "publisher": {
              "@type": "Organization",
              "name": "AI Lodi",
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/logo.png`,
                "width": 512,
                "height": 512
              }
            },
            "datePublished": post.publishDate,
            "dateModified": post.updatedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": currentUrl
            },
            "keywords": post.keywords?.join(', '),
            "articleSection": post.categories.join(', '),
            "wordCount": post.content.split(' ').length,
            "timeRequired": `PT${Math.ceil(post.content.split(' ').length / 200)}M`,
            "inLanguage": "en-US",
            "isAccessibleForFree": true,
            "copyrightYear": new Date(post.publishDate).getFullYear(),
            "copyrightHolder": {
              "@type": "Organization",
              "name": "AI Lodi"
            },
            "about": post.categories.map(category => ({
              "@type": "Thing",
              "name": category
            })),
            "mentions": post.tags.map(tag => ({
              "@type": "Thing",
              "name": tag
            }))
          })
        }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'
              },
              ...(post.categories[0] ? [{
                "@type": "ListItem",
                "position": 2,
                "name": post.categories[0],
                "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/categories?filter=${encodeURIComponent(post.categories[0])}`
              }] : []),
              {
                "@type": "ListItem",
                "position": post.categories[0] ? 3 : 2,
                "name": post.title,
                "item": currentUrl
              }
            ]
          })
        }}
      />
    </div>
  );
}