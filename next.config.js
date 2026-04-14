/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'studio.goodchoice.id',
      },
    ],
  },
}

module.exports = nextConfig
