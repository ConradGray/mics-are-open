/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/wall',
        destination: '/open-mic',
        permanent: true,
      },
      {
        source: '/wall/:path*',
        destination: '/open-mic/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
