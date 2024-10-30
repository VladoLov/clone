import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    //ppr: "incremental",
    after: true,
  },
  /* 
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: true,
  }, */
};

export default nextConfig;
