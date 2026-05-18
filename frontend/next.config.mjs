/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow importing from src/ directory
  experimental: {},
  webpack(config) {
    return config;
  },
};

export default nextConfig;
