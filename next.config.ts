import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_COMMIT_SHA: process.env.CF_PAGES_COMMIT_SHA || "LOCAL_DEV",
    NEXT_PUBLIC_BUILD_TIME: Date.now().toString(),
  },
};

export default nextConfig;