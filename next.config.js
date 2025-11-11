/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cxxifwpwarbrrodtzyqn.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
