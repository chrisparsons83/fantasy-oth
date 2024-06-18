/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['pbs.twimg.com'],
  },
  output: "standalone",
}

module.exports = nextConfig
