/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui", "@repo/api-client", "@repo/services", "@repo/types", "@repo/stores"],
  serverActions: {
    bodySizeLimit: "2mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "books.google.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
