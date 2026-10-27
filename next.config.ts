import type { NextConfig } from "next";
import { basePath } from "./lib/base-path";

const nextConfig: NextConfig = {
  // Serve only https://mbatravelsgoa.com/taxi-services/ (trailing slash matches the live URL).
  basePath,
  trailingSlash: true,
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 60 is used for the hero, which sits under a dark overlay.
    qualities: [60, 75],
  },
  // The app's bare root has no page; send it to the landing page.
  // (In production only /taxi-services/* is routed here, so this doesn't affect the WordPress homepage.)
  async redirects() {
    return [{ source: "/", destination: `${basePath}/`, basePath: false, permanent: false }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    // A stray package-lock.json in the user's home folder confuses root detection.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
