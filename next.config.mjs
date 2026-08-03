/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};
export default nextConfig;
