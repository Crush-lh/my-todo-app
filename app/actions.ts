// Server Actions - 直接在服务端操作数据库
'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { Todo } from '@/types/todo'
import { revalidatePath } from 'next/cache'

function getSimpleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function getTodos(): Promise<Todo[]> {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('获取待办失败:', error)
    return []
  }
  
  return data || []
}

export async function addTodo(title: string, description?: string): Promise<{ success: boolean; error?: string }> {
  if (!title.trim()) {
    return { success: false, error: '标题不能为空' }
  }
  
  try {
    const supabase = getSimpleClient()
    const { error } = await supabase
      .from('todos')
      .insert([{ title: title.trim(), completed: false }])
    
    if (error) {
      console.error('添加待办失败:', error)
      return { success: false, error: '添加失败: ' + error.message }
    }
    
    revalidatePath('/')
    return { success: true }
  } catch (e: any) {
    console.error('添加待办异常:', e)
    return { success: false, error: '添加异常: ' + (e?.message || String(e)) }
  }
}

export async function toggleTodo(id: string, completed: boolean): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient()
  
  const { error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id)
  
  if (error) {
    console.error('更新待办失败:', error)
    return { success: false }
  }
  
  revalidatePath('/')
  return { success: true }
}

export async function deleteTodo(id: string): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient()
  
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('删除待办失败:', error)
    return { success: false }
  }
  
  revalidatePath('/')
  return { success: true }
}

export async function updateTodo(id: string, title: string, description?: string): Promise<{ success: boolean; error?: string }> {
  if (!title.trim()) {
    return { success: false, error: '标题不能为空' }
  }
  
  const supabase = await createServerSupabaseClient()
  
  const { error } = await supabase
    .from('todos')
    .update({ title: title.trim() })
    .eq('id', id)
  
  if (error) {
    console.error('更新待办失败:', error)
    return { success: false, error: '更新失败，请重试' }
  }
  
  revalidatePath('/')
  return { success: true }
}