/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['auth.bssm.kro.kr'],
    minimumCacheTTL: 1
  },
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig
