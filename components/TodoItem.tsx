'use client'

import { Todo } from '@/types/todo'
import { createClient } from '@/lib/supabase'

export default function TodoItem({ todo, onUpdate }: { todo: Todo; onUpdate: () => void }) {
  const supabase = createClient()

  async function toggleComplete() {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id)

    if (error) {
      alert('更新失败: ' + error.message)
      return
    }
    onUpdate()
  }

  async function deleteTodo() {
    const { error } = await supabase.from('todos').delete().eq('id', todo.id)

    if (error) {
      alert('删除失败: ' + error.message)
      return
    }
    onUpdate()
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
      />
      <span
        className={`flex-1 text-gray-800 ${
          todo.completed ? 'line-through text-gray-400' : ''
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={deleteTodo}
        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        删除
      </button>
    </li>
  )
}
