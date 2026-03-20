/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@capiro/ui", "@capiro/types"],
  reactStrictMode: true,
};

module.exports = nextConfig;
