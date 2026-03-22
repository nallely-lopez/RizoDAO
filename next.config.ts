import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accesly.vercel.app",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accesly.vercel.app",
              "font-src 'self' https://fonts.gstatic.com",
              "frame-src 'self' https://accesly.vercel.app",
              "connect-src 'self' https://accesly.vercel.app https://horizon-testnet.stellar.org https://stellar.expert wss://accesly.vercel.app https://friendbot.stellar.org",
              "img-src 'self' data: https:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
