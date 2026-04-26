// Supabase 客户端配置（服务端 + 客户端）
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 客户端用（浏览器端）
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 服务端用（Server Component / Server Action）
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // 服务端组件无法设置 cookie，忽略
          }
        },
      },
    }
  )
}