/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Output standalone build for better compatibility with Render.com
  output: 'standalone',
};

module.exports = nextConfig;