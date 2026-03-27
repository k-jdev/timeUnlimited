/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'klgeaepragkplvmhbapf.supabase.co',
        pathname: '/**', // allow all paths
      },
    ],
  },
}
export default nextConfig
