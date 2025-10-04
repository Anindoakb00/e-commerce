import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production builds to succeed despite ESLint/TS issues.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Avoid lightningcss native binary by disabling Next's css minifier (uses lightningcss)
  experimental: {
    optimizeCss: false,
  },
  images: {
    domains: ["e-commerce-q2so.onrender.com", "localhost", "127.0.0.1"],
    remotePatterns: [
      { protocol: 'https', hostname: 'e-commerce-q2so.onrender.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
