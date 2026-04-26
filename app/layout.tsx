export const metadata = {
  title: '待办清单 - Todo App',
  description: '基于 Next.js + Supabase 的待办清单应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
