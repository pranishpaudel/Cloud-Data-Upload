/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "faces.nyc3.digitaloceanspaces.com",
      "images.pexels.com",
      "api.deepai.org",
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
