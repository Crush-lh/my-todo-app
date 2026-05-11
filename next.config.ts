import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverActions: {
    allowedOrigins: [
      'my-todo-app-git-main-cru-sh-s-projects.vercel.app',
      'lihan.rangzijigenghao.site',
    ],
  },
};

export default nextConfig;
