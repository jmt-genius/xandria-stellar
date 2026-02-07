import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chocolate-worldwide-earwig-657.mypinata.cloud",
        pathname: "/ipfs/**",
      },
    ],
  },
};

export default nextConfig;
