/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Netlify deployment
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Disable ESLint during builds (for preview deployment)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during builds (for preview deployment)
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig