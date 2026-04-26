'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AddTodo({ onAdd }: { onAdd: () => void }) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || loading) return

    setLoading(true)
    const { error } = await supabase.from('todos').insert({ title: title.trim() })
    setLoading(false)

    if (error) {
      alert('添加失败: ' + error.message)
      return
    }

    setTitle('')
    onAdd()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="输入待办事项..."
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
      >
        {loading ? '添加中...' : '添加'}
      </button>
    </form>
  )
}
