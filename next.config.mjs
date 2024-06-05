/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "faces.nyc3.digitaloceanspaces.com",
        pathname: "**", // Matches all paths under the specified hostname
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.deepai.org",
        pathname: "**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
