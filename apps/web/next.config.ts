import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@creator-intel/shared"],
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  async headers() {
    return [
      {
        source: "/api/feed/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-transform" },
          { key: "X-Accel-Buffering", value: "no" },
        ],
      },
    ];
  },
};

export default config;
