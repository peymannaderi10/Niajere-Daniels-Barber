/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: '/Niajere-Daniels-Barber',
  assetPrefix: '/Niajere-Daniels-Barber/',
}

module.exports = nextConfig 