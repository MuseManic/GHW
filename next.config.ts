/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' because we need API routes for authentication
  // Static export doesn't support API routes or server-side features
};
module.exports = nextConfig;
