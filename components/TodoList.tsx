'use client'

import { useEffect, useState, useCallback } from 'react'
import { Todo } from '@/types/todo'
import { createClient } from '@/lib/supabase'
import AddTodo from './AddTodo'
import TodoItem from './TodoItem'

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const supabase = createClient()

  const fetchTodos = useCallback(async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取失败:', error)
      return
    }

    setTodos(data || [])
  }, [supabase])

  useEffect(() => {
    // 订阅实时更新
    const channel = supabase
      .channel('todos_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        () => {
          fetchTodos()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchTodos])

  const completedCount = todos.filter((t) => t.completed).length
  const pendingCount = todos.length - completedCount

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 待办清单</h1>
        <p className="text-gray-500">
          {pendingCount} 个待办 · {completedCount} 个已完成
        </p>
      </div>

      <AddTodo onAdd={fetchTodos} />

      {todos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">还没有待办事项</p>
          <p className="text-sm mt-1">在上面添加一个吧！</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))}
        </ul>
      )}
    </div>
  )
}
