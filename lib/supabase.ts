// 统一 Supabase 配置（fallback 防止 Vercel 运行时环境变量缺失）
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xjawmygajknjlansmzyp.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable__tQUqUZR0WHMqoc6R2jWtQ_ClYYea2a'

// Supabase 客户端配置（服务端 + 客户端）
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 客户端用（浏览器端）
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// 服务端用（Server Component / Server Action）
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: object }[]
        ) {
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
