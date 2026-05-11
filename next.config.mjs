/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: [
        'my-todo-app-git-main-cru-sh-s-projects.vercel.app',
        'lihan.rangzijigenghao.site',
      ],
    },
  },
};

export default nextConfig;
