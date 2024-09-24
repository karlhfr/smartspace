/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'your-image-domain.com',
      'maps.googleapis.com',
      'maps.gstatic.com',
      'firebasestorage.googleapis.com',
    ],
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  // This will allow Vercel to handle 404s properly
  trailingSlash: true,
  // Disable static optimization to force dynamic rendering
  experimental: {
    disableOptimizedLoading: true,
  },
};

module.exports = nextConfig;
