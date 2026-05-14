/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'my-todo-app-git-main-cru-sh-s-projects.vercel.app',
        'todo-app-alpha-jet-43.vercel.app',
        'lihan.rangzijigenghao.site',
      ],
    },
  },
};

export default nextConfig;
