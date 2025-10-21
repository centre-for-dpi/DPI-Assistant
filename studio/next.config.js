
/** @type {import('next').NextConfig} */
const nextConfig = {
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
  env: {
    NEXT_PUBLIC_API_URL: process?.env?.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_AWS_REGION: process?.env?.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: process?.env?.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
    NEXT_PUBLIC_COGNITO_CLIENT_ID: process?.env?.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
  },
};

module.exports = nextConfig;
