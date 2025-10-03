import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  images: {
  domains: ["techbuilders-backend.onrender.com", "localhost", "127.0.0.1"],
    remotePatterns: [
      { protocol: 'https', hostname: 'techbuilders-backend.onrender.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
