/** @type {import('next').NextConfig} */
const nextConfig = {  
    images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080'      
      }, {
        protocol: 'https',
        hostname: 'collab.accountablebrand.org'
      },
    ],
  },
    async redirects() {
      return [
      ]
    },
  }

module.exports = nextConfig