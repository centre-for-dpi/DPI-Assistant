
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // experimental: {
  //   allowedDevOrigins: [
  //       "https://6000-firebase-studio-1749710637455.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev",
  //       "https://9000-firebase-studio-1749710637455.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev"
  //   ]
  // }
};

export default nextConfig;
