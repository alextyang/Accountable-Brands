/** @type {import('next').NextConfig} */
const nextConfig = {  
    images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: process.env.PORT     
      }, {
        protocol: 'https',
        hostname: 'collab.accountablebrand.org'
      },  {
        protocol: 'https',
        hostname: 'upload.wikimedia.org'
      },
    ],
  },
    async redirects() {
      return [
      ]
    },
  }

module.exports = nextConfig