/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://sales-dashboard-production-7f65.up.railway.app',
 },
}
module.exports = nextConfig
