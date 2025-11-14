import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { FolderOpen, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EnhancedBlogCard } from '@/components/enhanced-blog-card';
import { getAllContent } from '@/lib/content';
import type { Metadata } from 'next';
import type { BlogPost } from '@/types/blog';

interface CategoryPageProps {
  params: {
    categorySlug: string;
  };
}

// Helper function to normalize category names to slugs
function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Helper function to convert slug back to category name
function slugToCategory(slug: string, allCategories: string[]): string | null {
  const normalizedSlug = slug.toLowerCase();
  
  // Find the original category that matches this slug
  return allCategories.find(category => 
    categoryToSlug(category) === normalizedSlug
  ) || null;
}

// Generate static params for all categories
export async function generateStaticParams() {
  try {
    console.log('🏗️ BUILD: Generating static params for category pages...');
    
    const posts = await getAllContent();
    const allCategories = Array.from(new Set(posts.flatMap(post => post.categories || [])));
    
    const params = allCategories.map(category => ({
      categorySlug: categoryToSlug(category),
    }));
    
    console.log(`🏗️ BUILD: Generated ${params.length} category params:`, params.map(p => p.categorySlug));
    
    return params;
  } catch (error) {
    console.error('❌ BUILD: Error generating category static params:', error);
    return [];
  }
}

// Generate metadata for category pages
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const posts = await getAllContent();
    const allCategories = Array.from(new Set(posts.flatMap(post => post.categories || [])));
    const categoryName = slugToCategory(params.categorySlug, allCategories);
    
    if (!categoryName) {
      return {
        title: 'Category Not Found | AI Lodi',
        description: 'The requested category could not be found.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const categoryPosts = posts.filter(post => 
      post.categories.some(cat => categoryToSlug(cat) === params.categorySlug)
    );

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz';
    const categoryUrl = `${baseUrl}/categories/${params.categorySlug}`;

    return {
      title: `${categoryName} Articles | AI Lodi - Tech Insights & AI Innovation`,
      description: `Explore ${categoryPosts.length} articles about ${categoryName}. Discover in-depth insights, tutorials, and analysis on ${categoryName} topics at AI Lodi.`,
      keywords: [
        categoryName.toLowerCase(),
        `${categoryName.toLowerCase()} articles`,
        `${categoryName.toLowerCase()} insights`,
        `${categoryName.toLowerCase()} tutorials`,
        'AI Lodi',
        'tech insights',
        'technology',
        'artificial intelligence',
        'programming',
        'innovation'
      ],
      authors: [{ name: 'AI Lodi Team', url: `${baseUrl}/about` }],
      creator: 'AI Lodi',
      publisher: 'AI Lodi',
      category: categoryName,
      alternates: {
        canonical: categoryUrl,
      },
      openGraph: {
        title: `${categoryName} Articles | AI Lodi`,
        description: `Explore ${categoryPosts.length} articles about ${categoryName}. Discover in-depth insights and analysis.`,
        type: 'website',
        url: categoryUrl,
        siteName: 'AI Lodi',
        images: [{
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${categoryName} Articles - AI Lodi`,
          type: 'image/jpeg',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryName} Articles | AI Lodi`,
        description: `Explore ${categoryPosts.length} articles about ${categoryName}. Discover in-depth insights and analysis.`,
        images: [`${baseUrl}/og-image.jpg`],
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
    };
  } catch (error) {
    console.error('❌ Error generating category metadata:', error);
    return {
      title: 'Category | AI Lodi',
      description: 'Explore articles by category at AI Lodi.',
    };
  }
}

// Category page component
export default async function CategoryPage({ params }: CategoryPageProps) {
  let posts: BlogPost[];
  let allCategories: string[];
  
  try {
    posts = await getAllContent();
    allCategories = Array.from(new Set(posts.flatMap(post => post.categories || [])));
  } catch (error) {
    console.error('❌ Error fetching content for category page:', error);
    notFound();
  }

  const categoryName = slugToCategory(params.categorySlug, allCategories);
  
  if (!categoryName) {
    console.log(`❌ Category not found for slug: ${params.categorySlug}`);
    console.log(`📋 Available categories:`, allCategories.map(cat => `"${cat}" -> "${categoryToSlug(cat)}"`));
    notFound();
  }

  const categoryPosts = posts.filter(post => 
    post.categories.some(cat => categoryToSlug(cat) === params.categorySlug)
  ).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/categories/${params.categorySlug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <FolderOpen size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">Category</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{categoryName}</h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          {categoryPosts.length} {categoryPosts.length === 1 ? 'article' : 'articles'} in this category
        </p>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Link 
            href="/categories"
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to all categories
          </Link>
          <span>•</span>
          <div className="flex items-center gap-1">
            <FileText size={14} />
            <span>{categoryPosts.length} articles</span>
          </div>
        </div>
      </div>

      {/* Articles List */}
      {categoryPosts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderOpen size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">No articles found</h2>
          <p className="text-lg text-muted-foreground mb-8">
            There are no published articles in the "{categoryName}" category yet.
          </p>
          <Link 
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            <FolderOpen size={18} />
            Browse All Categories
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {categoryPosts.map((post, index) => (
            <EnhancedBlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}

      {/* Structured Data for Category Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${categoryName} Articles`,
            "description": `Collection of articles about ${categoryName}`,
            "url": currentUrl,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": categoryPosts.length,
              "itemListElement": categoryPosts.map((post, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Article",
                  "headline": post.title,
                  "description": post.metaDescription,
                  "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/post/${post.slug}`,
                  "datePublished": post.publishDate,
                  "dateModified": post.updatedAt,
                  "author": {
                    "@type": "Person",
                    "name": post.author
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "AI Lodi"
                  }
                }
              }))
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Categories",
                  "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ailodi.xyz'}/categories`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": categoryName,
                  "item": currentUrl
                }
              ]
            }
          })
        }}
      />
    </div>
  );
}