/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Episode thumbnails for the homepage hero
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
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
