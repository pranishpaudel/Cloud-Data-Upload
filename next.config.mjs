/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "faces.nyc3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "api.deepai.org",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
