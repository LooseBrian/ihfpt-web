import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" removed — Amazon-style vendor-code URLs (/store/SRXXXXXXXX)
  // require dynamic route rendering at runtime. Supplier codes are created when
  // suppliers register, so they cannot be pre-generated at build time.
  // The project deploys with `next start` (Node.js server), so SSR/ISR is available.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
