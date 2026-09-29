/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "shahbanoo.shop",
      "localhost",
      "127.0.0.1",
      "87.107.12.81",
      "192.168.1.167",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shahbanoo.shop",
        pathname: "/api/files/**",
      },
    ],
  },
};

module.exports = nextConfig;
