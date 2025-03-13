/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable experimental features for path aliases
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;