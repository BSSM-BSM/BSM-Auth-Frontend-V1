/** @type {import('next').NextConfig} */

const RESOURCE_BASE_URL = process.env.NEXT_PUBLIC_RESOURCE_BASE_URL;

const nextConfig = {
  compiler: {
    styledComponents: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'auth.bssm.app'
      }
    ],
    minimumCacheTTL: 60
  },
  reactStrictMode: false,
  swcMinify: true,
  rewrites() {
    return [
      {
        source: '/resource/:path*',
        destination: `${RESOURCE_BASE_URL}/:path*`
      }
    ]
  }
};

module.exports = nextConfig
