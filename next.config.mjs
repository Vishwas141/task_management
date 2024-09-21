/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@hello-pangea/dnd'],
    experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
