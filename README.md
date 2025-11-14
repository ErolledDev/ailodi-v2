![Ailodi Screenshot](https://i.ibb.co/TSDTQ80/ailodi.jpg)

# AI Lodi - Next.js Blog Platform

A **production-ready** blog platform built with Next.js 14, featuring a clean Medium-inspired design, comprehensive SEO optimization, and integrated comment system. Perfect for tech blogs, personal websites, and professional content creators.

## 🌟 Key Features

### **🎨 Professional Design**
- **Medium-Inspired Interface**: Clean, readable, professional layout
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Dark/Light Mode**: Theme switching with next-themes
- **Custom Branding**: Easy logo, colors, and typography customization
- **Accessibility**: WCAG 2.1 AA compliant

### **⚡ Performance & SEO**
- **Static Export**: Lightning-fast loading times
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, structured data
- **Sitemap & RSS**: Auto-generated XML sitemap and RSS feeds
- **Image Optimization**: WebP/AVIF conversion, lazy loading
- **Core Web Vitals**: Optimized for Google's performance metrics

### **🔧 Developer Experience**
- **TypeScript**: Full type safety throughout
- **Modern Stack**: Next.js 14, Tailwind CSS, shadcn/ui
- **Component Library**: 40+ pre-built, customizable components
- **API Integration**: Flexible content fetching with retry logic
- **Error Handling**: Comprehensive error boundaries and fallbacks

### **💬 User Engagement**
- **Comments System**: Valine comments with LeanCloud backend
- **Social Sharing**: 10+ platforms including WhatsApp, Telegram
- **Newsletter**: Email subscription with LeanCloud integration
- **Search**: Advanced search with fuzzy matching and filters
- **Related Posts**: Content recommendations based on categories

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14+** with App Router and Static Export
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **React Markdown** for content rendering

### **Backend & Services**
- **External API** for content management (currently: blogform.netlify.app)
- **LeanCloud** for comments and newsletter subscriptions
- **Valine** for comments system with security features

### **SEO & Analytics**
- **Google Analytics 4** integration
- **Plausible Analytics** support
- **JSON-LD** structured data
- **Open Graph** and Twitter Cards
- **XML Sitemap** generation

## 📋 Prerequisites

- **Node.js 18+** 
- **npm/yarn/pnpm**
- **LeanCloud account** (free tier available)
- **Content API** endpoint

## 🚀 Quick Start

### 1. **Clone & Install**
```bash
git clone <your-repo-url>
cd ai-lodi-blog
npm install
```

### 2. **LeanCloud Setup** (for comments & newsletter)
1. Create account at [LeanCloud](https://leancloud.app/)
2. Create new application
3. Get App ID, App Key, and Server URL from Settings > App Keys

### 3. **Environment Configuration**
```bash
cp .env.example .env.local
```

Configure your `.env.local`:
```env
# Content API
NEXT_PUBLIC_API_URL=https://your-content-api.com/api/posts

# LeanCloud (for comments & newsletter)
NEXT_PUBLIC_VALINE_APP_ID=your_app_id
NEXT_PUBLIC_VALINE_APP_KEY=your_app_key
NEXT_PUBLIC_VALINE_SERVER_URLS=https://your_app_id.api.lncldglobal.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com

# Contact Form
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key
```

### 4. **Development**
```bash
npm run dev
```

### 5. **Production Build**
```bash
npm run build
```

## 🎨 Complete Customization Guide

This comprehensive guide covers all aspects of customizing your AI Lodi website. Each section provides specific file locations and detailed instructions for modifications.

### **I. Core Site Information**

These settings define the fundamental identity of your website.

#### **Site URL & Basic Info**
- **Purpose**: Sets the canonical URL and basic site information
- **Location**: Environment variables in `.env.local` and metadata in `app/layout.tsx`
- **Environment Variables**:
  ```env
  NEXT_PUBLIC_SITE_URL=https://yourdomain.com
  NEXT_PUBLIC_SITE_NAME=Your Blog Name
  ```
- **Metadata Location**: `app/layout.tsx` - Update the `metadata` export
- **Files to modify**:
  - `.env.local` - Site URL and name
  - `app/layout.tsx` - Title, description, keywords, and all metadata

### **II. Branding & Visual Identity**

#### **Logos & Icons**
- **Purpose**: Visual identity across browsers, social media, and PWA
- **Location**: Image files in the `public/` directory
- **Required Files** (replace with your own):
  - `logo.png` - Used in structured data and RSS feed (512x512px)
  - `favicon.ico`, `favicon.svg` - Browser favicons
  - `apple-touch-icon.png` - iOS home screen icon (180x180px)
  - `icon-192.png`, `icon-512.png` - PWA icons
  - `og-image.jpg` - Open Graph image for social sharing (1200x630px)
  - `og-image-square.jpg` - Square Open Graph image (1200x1200px)
  - `screenshot-wide.png`, `screenshot-narrow.png` - PWA screenshots
  - `mstile-*.png` - Microsoft tile icons
- **Configuration Files**:
  - `app/layout.tsx` - Icon references in metadata
  - `public/manifest.json` - PWA icon paths
  - `public/browserconfig.xml` - Microsoft tile configuration

#### **Colors & Theme**
- **Purpose**: Define your brand colors and theme
- **Location**: CSS variables in `app/globals.css`
- **Key Variables to Modify**:
  ```css
  :root {
    --primary: 142 76% 36%; /* Your brand color */
    --primary-foreground: 355 20% 98%;
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    /* ... other color variables */
  }
  ```

#### **Typography**
- **Purpose**: Control fonts for headings and body text
- **Location**: 
  - Font imports: `app/layout.tsx`
  - CSS variables: `app/globals.css`
- **Steps**:
  1. Change Google Font imports in `app/layout.tsx`
  2. Update CSS font variables in `app/globals.css`

### **III. Content Management**

#### **Content API Configuration**
- **Purpose**: Specifies where blog content is fetched from
- **Current Setup**: External API at `https://blogform.netlify.app/api/content.json`
- **Location**: `NEXT_PUBLIC_API_URL` in `.env.local`
- **Content Processing**: `lib/content.ts` handles fetching and processing
- **Required JSON Structure**:
  ```json
  [
    {
      "id": "unique-post-id",
      "title": "Post Title",
      "slug": "post-slug",
      "content": "Markdown content...",
      "metaDescription": "SEO description",
      "seoTitle": "SEO title",
      "keywords": ["keyword1", "keyword2"],
      "author": "Author Name",
      "categories": ["Category1", "Category2"],
      "tags": ["tag1", "tag2"],
      "status": "published",
      "publishDate": "2025-01-01T00:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z",
      "featuredImageUrl": "https://example.com/image.jpg"
    }
  ]
  ```

#### **Custom API Integration**
If your API has a different structure, modify the content processing in `lib/content.ts`:
- Update the `getAllContent()` function
- Modify the `getContentBySlug()` function
- Adjust the `BlogPost` interface in `types/blog.ts` if needed

### **IV. SEO & Metadata**

#### **Global SEO Settings**
- **Location**: `app/layout.tsx` - `metadata` export
- **Key Fields**:
  - `title` - Site title and template
  - `description` - Site description
  - `keywords` - Array of relevant keywords
  - `openGraph` - Facebook/social media data
  - `twitter` - Twitter card configuration
  - `verification` - Search engine verification codes

#### **Dynamic SEO (Posts & Categories)**
- **Post Pages**: `app/post/[slug]/page.tsx` - `generateMetadata` function
- **Category Pages**: `app/categories/[categorySlug]/page.tsx` - `generateMetadata` function
- **Automatic Generation**: 
  - `app/sitemap.ts` - XML sitemap
  - `app/robots.ts` - Robots.txt
  - `app/feed.xml/route.ts` - RSS feed

### **V. Integrations & Services**

#### **Analytics**
- **Google Analytics**: 
  - Variable: `NEXT_PUBLIC_GA_ID` in `.env.local`
  - Component: `components/google-analytics.tsx`
- **Plausible Analytics**: 
  - Variable: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in `.env.local`

#### **Comments System (Valine + LeanCloud)**
- **Purpose**: User comments on blog posts
- **Variables** (in `.env.local`):
  ```env
  NEXT_PUBLIC_VALINE_APP_ID=your_app_id
  NEXT_PUBLIC_VALINE_APP_KEY=your_app_key
  NEXT_PUBLIC_VALINE_SERVER_URLS=https://your_app_id.api.lncldglobal.com
  ```
- **Component**: `components/valine-comments.tsx`
- **Security Features**:
  - Math captcha for spam prevention
  - Content moderation through LeanCloud
  - IP tracking and rate limiting
  - User verification options

#### **Newsletter Subscription**
- **Purpose**: Email list management
- **Backend**: Uses same LeanCloud credentials as comments
- **Component**: `components/subscribe-form.tsx`
- **API Route**: `app/api/subscribe/route.ts`

#### **Contact Form**
- **Service**: Web3Forms
- **Variable**: `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in `.env.local`
- **Component**: `app/contact/page.tsx`

### **VI. Navigation & Layout**

#### **Main Navigation**
- **File**: `components/navigation.tsx`
- **Customization**: Update menu items, search functionality, mobile menu

#### **Footer**
- **File**: `components/footer.tsx`
- **Customization**: Update links, social media, newsletter signup

#### **Homepage Sections**
- **Hero Section**: `components/hero.tsx`
- **Latest Insights**: `components/latest-insights.tsx`
- **Blog Posts**: `components/blog-posts.tsx`

### **VII. Advanced Customization**

#### **Component Customization**
Key components you can modify:
- **Blog Cards**: `components/enhanced-blog-card.tsx`
- **Article Layout**: `components/article-layout.tsx`
- **Social Sharing**: `components/social-share-buttons.tsx`
- **Search Page**: `app/search/page.tsx`
- **Category Pages**: `app/categories/[categorySlug]/page.tsx`

#### **Styling System**
- **Framework**: Tailwind CSS with custom design system
- **Components**: shadcn/ui component library
- **Configuration**: `tailwind.config.ts` for design tokens
- **Global Styles**: `app/globals.css` for custom CSS and theme variables

#### **Content Types**
The blog supports various content types defined in `types/blog.ts`:
- Blog posts with full metadata
- Categories and tags
- Author information
- SEO optimization fields

### **VIII. Deployment**

#### **Environment Variables for Production**
Ensure these variables are set in your hosting provider's dashboard:

**Required:**
- `NEXT_PUBLIC_SITE_URL` - Your production domain
- `NEXT_PUBLIC_API_URL` - Your content API endpoint

**Optional but Recommended:**
- `NEXT_PUBLIC_GA_ID` - Google Analytics
- `NEXT_PUBLIC_VALINE_APP_ID` - Comments system
- `NEXT_PUBLIC_VALINE_APP_KEY` - Comments system
- `NEXT_PUBLIC_VALINE_SERVER_URLS` - Comments system
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` - Contact form

#### **Build Configuration**
- **Build Command**: `npm run build`
- **Output Directory**: `out` (for static export)
- **Node Version**: 18+ recommended

#### **Deployment Options**
- **Cloudflare Pages**: Recommended for static export
- **Netlify**: JAMstack deployment
- **Vercel**: Next.js optimized hosting
- **Any Static Host**: Works with any CDN

## 📊 Project Structure

```
ai-lodi-blog/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Global layout and metadata
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles and theme
│   ├── about/                   # About page
│   ├── categories/              # Category pages
│   ├── contact/                 # Contact page
│   ├── post/[slug]/            # Dynamic blog post pages
│   ├── search/                  # Search functionality
│   ├── sitemap.ts              # Dynamic sitemap generation
│   ├── robots.ts               # Robots.txt generation
│   ├── feed.xml/               # RSS feed generation
│   ├── api/subscribe/          # Newsletter API
│   ├── privacy-policy/         # Privacy policy page
│   ├── terms-of-service/       # Terms of service page
│   └── disclaimer/             # Disclaimer page
├── components/                  # Reusable React components
│   ├── ui/                     # shadcn/ui components
│   ├── navigation.tsx          # Main navigation
│   ├── footer.tsx              # Site footer
│   ├── hero.tsx                # Homepage hero section
│   ├── blog-posts.tsx          # Blog post listing
│   ├── enhanced-blog-card.tsx  # Individual blog post cards
│   ├── article-layout.tsx      # Blog post layout
│   ├── valine-comments.tsx     # Comments system
│   ├── subscribe-form.tsx      # Newsletter subscription
│   ├── social-share-buttons.tsx # Social sharing
│   └── ...                     # Other components
├── lib/                        # Utility functions
│   ├── content.ts              # Content fetching and processing
│   └── utils.ts                # General utilities
├── types/                      # TypeScript type definitions
│   └── blog.ts                 # Blog post interface
├── public/                     # Static assets
│   ├── logo.png                # Site logo
│   ├── favicon.ico             # Favicon
│   ├── og-image.jpg            # Open Graph image
│   ├── manifest.json           # PWA manifest
│   ├── browserconfig.xml       # Microsoft tile config
│   └── ...                     # Other icons and images
├── scripts/                    # Build scripts
│   └── generate-metadata.js    # Metadata generation
├── .env.example                # Environment variables template
├── .env.local                  # Your environment variables (not in repo)
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Generate metadata (runs automatically during build)
npm run generate-metadata

# Clean build artifacts
npm run clean

# Fresh build (clean + build)
npm run fresh-build
```

## 🛡️ Security Features

### **Comments Security (Valine + LeanCloud)**
- **Math Captcha**: Prevents automated spam
- **Content Moderation**: Real-time filtering and admin dashboard
- **Rate Limiting**: Prevents comment flooding
- **IP Tracking**: Monitor and block problematic users
- **User Verification**: Optional email validation

### **General Security**
- **HTTPS Enforced**: SSL/TLS encryption
- **Security Headers**: XSS, CSRF protection via `_headers` file
- **Input Sanitization**: Secure data handling
- **Environment Variables**: Sensitive data protection

## 📈 Performance Features

- **Static Export**: Pre-rendered pages for maximum speed
- **Image Optimization**: WebP/AVIF conversion, lazy loading
- **Code Splitting**: Automatic bundle optimization
- **Edge Deployment**: Global CDN distribution
- **Core Web Vitals**: Optimized for Google's performance metrics

## 🎯 SEO Features

- **Structured Data**: JSON-LD for rich snippets
- **Open Graph**: Social media optimization
- **Twitter Cards**: Twitter-specific metadata
- **XML Sitemap**: Auto-generated and updated
- **RSS Feed**: Auto-generated content feed
- **Meta Tags**: Comprehensive SEO metadata
- **Canonical URLs**: Prevent duplicate content issues

## 📱 PWA Features

- **App Manifest**: Installable web app
- **Service Worker**: Offline functionality (can be enabled)
- **App Icons**: Multiple sizes for different devices
- **Splash Screens**: Custom loading screens
- **Theme Colors**: Consistent branding

## 🤝 Contributing

This is a commercial project. For customization help or feature requests, please contact the development team.

## 📄 License

This project uses a commercial license. See the `LICENSE` file for details.

## 📞 Support

For technical support or customization assistance:
- **Email**: support@ailodi.tech
- **Documentation**: This README and inline code comments
- **Issues**: Use GitHub issues for bug reports

---

**Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS.**
