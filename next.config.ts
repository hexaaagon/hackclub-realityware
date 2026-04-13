// TODO: setup fumadocs later
import createBundleAnalyzer from "@next/bundle-analyzer";
// import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "typescript",
    // "@takumi-rs/image-response",
    // "shiki",
    // "twoslash",
    // "vscode-oniguruma",
  ],
  experimental: {
    optimizePackageImports: [
      "@icons-pack/react-simple-icons",
      // "@paper-design/shaders-react",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cachet.dunkirk.sh",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/p/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/api/p/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: ["192.168.1.*"],
  reactCompiler: true,
  reactStrictMode: true,
};

// const withMDX = createMDX();
const withMDX = (config: NextConfig) => config;
const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer(withMDX(nextConfig));
