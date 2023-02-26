/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
   experimental:{
      appDir: false
   },
   typescript: {
      ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
