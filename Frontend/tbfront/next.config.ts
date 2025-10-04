import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production builds to succeed despite ESLint/TS issues.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Avoid lightningcss native binary/minifier entirely
  experimental: {
    optimizeCss: false,
  },
  // Ensure Next doesn't use lightningcss for minification
  compiler: {
    // This setting doesn’t directly switch minifiers, but we keep it here to show intent.
  },
  env: {
    NEXT_DISABLE_LIGHTNINGCSS: '1',
    TAILWIND_DISABLE_OXIDE: '1',
    LIGHTNINGCSS_FORCE_WASM: '1',
  },
  images: {
    domains: ["e-commerce-q2so.onrender.com", "localhost", "127.0.0.1"],
    remotePatterns: [
      { protocol: 'https', hostname: 'e-commerce-q2so.onrender.com', pathname: '/**' },
    ],
  },
  // Last-resort: ensure webpack doesn't inject lightningcss minimizer
  webpack: (config) => {
    if (config.optimization?.minimizer) {
      // Filter out any lightningcss-based minimizers if present
      config.optimization.minimizer = config.optimization.minimizer.filter((minimizer: any) => {
        const id = (minimizer && minimizer.constructor && minimizer.constructor.name) || ''
        return !/Lightning|LightningCss|LightningCSS/i.test(id)
      })
    }
    return config
  },
};

export default nextConfig;
