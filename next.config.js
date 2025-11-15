/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Enable static export for Cloudflare Workers compatibility (disabled in dev for middleware)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: process.env.NODE_ENV === 'production',
  
  // Disable caching during build for fresh content
  onDemandEntries: {
    maxInactiveAge: 0,
    pagesBufferLength: 0,
  },
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization configuration for Cloudflare
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'firebasestorage.googleapis.com',
      'images.unsplash.com',
      'images.pexels.com',
      'cdn.jsdelivr.net',
      'via.placeholder.com',
      'api.dicebear.com',
      'blogform.netlify.app'
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Enhanced build configuration for fresh content
  generateBuildId: async () => {
    // Use timestamp and random string to ensure fresh builds
    return `build-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  },
};

module.exports = nextConfig;