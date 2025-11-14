# Post-Development Setup for AI Lodi Website

This document outlines crucial steps and configurations required after development to ensure optimal SEO, performance, and user experience for the AI Lodi website. These steps primarily involve placing specific asset files and updating configuration files with their correct paths and details.

## 1. Required Asset Files.

All the following image and icon files **must be placed directly into the `public/` directory** of your project. The `public/` folder serves static assets directly from the root of your domain (e.g., `public/og-image.jpg` is accessible at `yourdomain.com/og-image.jpg`).

### Image Assets:

*   **`og-image.jpg`**
    *   **Purpose**: Main Open Graph image for social media sharing (e.g., Facebook, LinkedIn, Twitter).
    *   **Recommended Dimensions**: 1200x630 pixels.
*   **`og-image-square.jpg`**
    *   **Purpose**: Square Open Graph image for social media sharing (e.g., Instagram, some mobile previews).
    *   **Recommended Dimensions**: 1200x1200 pixels.
*   **`logo.png`**
    *   **Purpose**: High-resolution logo used in structured data and RSS feed.
    *   **Recommended Dimensions**: 512x512 pixels (or suitable for a clear, square logo).
*   **`screenshot-wide.png`**
    *   **Purpose**: Screenshot for Progressive Web App (PWA) manifest (wide screen).
    *   **Recommended Dimensions**: 1280x720 pixels.
*   **`screenshot-narrow.png`**
    *   **Purpose**: Screenshot for Progressive Web App (PWA) manifest (narrow/mobile screen).
    *   **Recommended Dimensions**: 640x1136 pixels.

### Icon Assets:

*   **`favicon.ico`**
    *   **Purpose**: Standard favicon for browsers.
    *   **Recommended Dimensions**: 32x32 pixels.
*   **`favicon.svg`**
    *   **Purpose**: Scalable Vector Graphics favicon for modern browsers.
    *   **Recommended Dimensions**: Vector, any size.
*   **`apple-touch-icon.png`**
    *   **Purpose**: Icon for iOS devices when added to home screen.
    *   **Recommended Dimensions**: 180x180 pixels.
*   **`icon-192.png`**
    *   **Purpose**: PWA icon (medium size).
    *   **Recommended Dimensions**: 192x192 pixels.
*   **`icon-512.png`**
    *   **Purpose**: PWA icon (large size).
    *   **Recommended Dimensions**: 512x512 pixels.
*   **`mstile-70x70.png`**
    *   **Purpose**: Microsoft Tile icon (small).
    *   **Recommended Dimensions**: 70x70 pixels.
*   **`mstile-150x150.png`**
    *   **Purpose**: Microsoft Tile icon (medium).
    *   **Recommended Dimensions**: 150x150 pixels.
*   **`mstile-310x310.png`**
    *   **Purpose**: Microsoft Tile icon (large).
    *   **Recommended Dimensions**: 310x310 pixels.
*   **`mstile-310x150.png`**
    *   **Purpose**: Microsoft Tile icon (wide).
    *   **Recommended Dimensions**: 310x150 pixels.

## 2. Configuration Updates

After placing the assets in the `public/` folder, you need to ensure that all references to these assets and other SEO-related configurations are correctly updated.

### 2.1. `app/layout.tsx`

This file contains the global metadata for your website, including Open Graph, Twitter Cards, and structured data.

*   **`metadata.openGraph.images`**:
    *   **Path**: `app/layout.tsx`
    *   **Details**: Update the `url`, `width`, `height`, `alt`, and `type` for both `og-image.jpg` and `og-image-square.jpg`. Ensure the `url` points to the correct path relative to your domain root (e.g., `/og-image.jpg`).
*   **`metadata.twitter.images`**:
    *   **Path**: `app/layout.tsx`
    *   **Details**: Update the `url` to point to `og-image.jpg` (e.g., `/og-image.jpg`).
*   **`link` tags in `<head>`**:
    *   **Path**: `app/layout.tsx`
    *   **Details**: Verify that the `href` attributes for `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, and `manifest.json` correctly point to their respective files in the `public/` directory.
*   **`meta` tags in `<head>` (PWA/MS Tile related)**:
    *   **Path**: `app/layout.tsx`
    *   **Details**: Confirm `theme-color`, `msapplication-TileColor`, `application-name`, `apple-mobile-web-app-title`, `apple-mobile-web-app-capable`, and `msapplication-config` (which points to `/browserconfig.xml`) are correctly set.
*   **Structured Data (`application/ld+json`)**:
    *   **Path**: `app/layout.tsx`
    *   **Details**: In the `Organization` schema, ensure the `logo.url` points to `/logo.png`.

### 2.2. `public/manifest.json`

This file defines your Progressive Web App (PWA) properties.

*   **`icons` array**:
    *   **Path**: `public/manifest.json`
    *   **Details**: Update the `src` paths for all listed icons (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) to reflect their location directly in the `public/` folder (e.g., `/icon-192.png`).
*   **`screenshots` array**:
    *   **Path**: `public/manifest.json`
    *   **Details**: Update the `src` paths for `screenshot-wide.png` and `screenshot-narrow.png` to reflect their location directly in the `public/` folder (e.g., `/screenshot-wide.png`).

### 2.3. `public/browserconfig.xml`

This file is used by Microsoft browsers for tile customization.

*   **`msapplication.tile` elements**:
    *   **Path**: `public/browserconfig.xml`
    *   **Details**: Update the `src` paths for all `mstile-*.png` images to reflect their location directly in the `public/` folder (e.g., `/mstile-150x150.png`).

### 2.4. `next.config.js`

This file configures Next.js build and image optimization settings.

*   **`images.domains`**:
    *   **Path**: `next.config.js`
    *   **Details**: Ensure that all external domains from which your application loads images (e.g., `api.dicebear.com`, `blogform.netlify.app`, `images.unsplash.com`) are explicitly listed in this array. This is crucial for Next.js's image optimization to work correctly with external images.

### 2.5. `app/feed.xml/route.ts`

This file programmatically generates your RSS feed.

*   **`image.url`**:
    *   **Path**: `app/feed.xml/route.ts`
    *   **Details**: Update the `url` for the RSS feed image to point to `/logo.png`.

## 3. Environment Variables

Ensure the following environment variables are correctly set in your deployment environment (e.g., Netlify, Vercel, Cloudflare Pages settings):

*   **`NEXT_PUBLIC_SITE_URL`**: Your website's canonical URL (e.g., `https://ailodi.tech`).
*   **`NEXT_PUBLIC_SITE_NAME`**: The name of your website (e.g., `AI Lodi`).

## 4. Verification Codes

If you plan to verify your site with search engines (Google Search Console, Yandex Webmaster Tools, Bing Webmaster Tools), remember to update the placeholder verification codes in `app/layout.tsx`:

*   **`metadata.verification.google`**
*   **`metadata.verification.yandex`**
*   **`metadata.verification.yahoo`**
*   **`metadata.verification.other['msvalidate.01']`** (for Bing)

## 5. Other SEO & Performance Files

The following files are already configured for optimal SEO and performance, but it's good to be aware of their purpose:

*   **`_headers`**: (Root of your project) Contains Cloudflare Pages specific headers for caching, security, and performance. Review and adjust if your caching strategy changes.
*   **`app/robots.ts`**: (App Router) Programmatically generates your `robots.txt` file, guiding search engine crawlers. Review the `rules` to ensure appropriate `allow` and `disallow` directives for your content.
*   **`app/sitemap.ts`**: (App Router) Programmatically generates your `sitemap.xml` file, helping search engines discover and index your content efficiently. This includes dynamic generation for blog posts and category pages.

By following these steps, you will ensure your AI Lodi website is fully optimized for search engines, provides a great user experience, and leverages modern web capabilities.
