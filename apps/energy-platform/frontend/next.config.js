/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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