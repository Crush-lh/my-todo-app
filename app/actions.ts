// Server Actions - 直接在服务端操作数据库
'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { Todo } from '@/types/todo'
import { revalidatePath } from 'next/cache'
import { autoCategorize } from '@/lib/category'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xjawmygajknjlansmzyp.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable__tQUqUZR0WHMqoc6R2jWtQ_ClYYea2a'

function getSimpleClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
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

export async function addTodo(title: string, description?: string, category?: string, priority?: string): Promise<{ success: boolean; error?: string; category?: string | null }> {
  if (!title.trim()) {
    return { success: false, error: '标题不能为空' }
  }
  
  try {
    const supabase = getSimpleClient()
    
    // 自动分类：如果没有手动指定分类，则自动识别
    const autoCategory = category?.trim() || autoCategorize(title, description)
    
    const insertData: any = { 
      title: title.trim(), 
      completed: false 
    }
    if (description?.trim()) {
      insertData.description = description.trim()
    }
    if (autoCategory) {
      insertData.category = autoCategory
    }
    if (priority?.trim()) {
      insertData.priority = priority.trim()
    }
    
    const { data, error } = await supabase
      .from('todos')
      .insert([insertData])
      .select()
    
    if (error) {
      console.error('Supabase insert 失败:', error)
      return { success: false, error: '数据库写入失败: ' + (error.message || JSON.stringify(error)) }
    }
    
    revalidatePath('/')
    return { success: true, category: autoCategory }
  } catch (e: any) {
    console.error('addTodo 异常:', e)
    return { success: false, error: '服务端异常: ' + (e?.message || e?.toString?.() || String(e)) }
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

export async function updateTodo(id: string, title: string, description?: string, category?: string, priority?: string): Promise<{ success: boolean; error?: string }> {
  if (!title.trim()) {
    return { success: false, error: '标题不能为空' }
  }
  
  const supabase = await createServerSupabaseClient()
  
  const updateData: any = { title: title.trim() }
  if (description !== undefined) {
    updateData.description = description.trim() || null
  }
  if (category !== undefined) {
    updateData.category = category.trim() || null
  }
  if (priority !== undefined) {
    updateData.priority = priority.trim() || null
  }
  
  const { error } = await supabase
    .from('todos')
    .update(updateData)
    .eq('id', id)
  
  if (error) {
    console.error('更新待办失败:', error)
    return { success: false, error: '更新失败，请重试' }
  }
  
  revalidatePath('/')
  return { success: true }
}