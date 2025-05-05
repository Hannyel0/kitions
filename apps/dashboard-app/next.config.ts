import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'panftygjjjgfwfrpwlbj.supabase.co',
        port: '', // leave empty unless you're using a custom port
        pathname: '/storage/v1/object/public/profile-pictures/**',
      },
    ],
  },
};

export default nextConfig;
