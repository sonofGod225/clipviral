/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve these modules on the client to prevent errors
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        os: false,
        path: false,
        perf_hooks: false,
        child_process: false,
        dns: false,
        stream: false,
      }
    }
    return config
  },
}

module.exports = nextConfig 