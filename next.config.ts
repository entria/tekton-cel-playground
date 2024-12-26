import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/evaluate', // The path in your Next.js app
        destination: 'http://localhost:3002/api/evaluate', // Go API endpoint
      },
    ]
  },
};

export default nextConfig;
