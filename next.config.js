/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'your-image-domain.com',
      'maps.googleapis.com',
      'maps.gstatic.com',
      'firebasestorage.googleapis.com'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // This will allow Vercel to handle 404s properly
  trailingSlash: true,
  // Disable static optimization to force dynamic rendering
  experimental: {
    disableOptimizedLoading: true,
    appDir: true,
  },
}

module.exports = nextConfig