/** @type {import('next').NextConfig} */
const nextConfig = {
  // 明确指定使用src目录结构
  distDir: '.next',
  // 解决跨域问题
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // 添加QAnything API代理
      {
        source: '/qanything-api/:path*',
        destination: 'https://openapi.youdao.com/q_anything/api/:path*',
      },
    ];
  },
};

export default nextConfig;