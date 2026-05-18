'use client'

import { useState } from 'react'
import { addTodo } from '../actions'

const CATEGORIES = [
  { value: '', label: '选择分类（可选）' },
  { value: '工作', label: '💼 工作' },
  { value: '学习', label: '📚 学习' },
  { value: '生活', label: '🏠 生活' },
]

export default function AddTodoForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      const result = await addTodo(title, description || undefined, category || undefined)
      console.log('addTodo result:', result)
      if (result.success) {
        setTitle('')
        setDescription('')
        setCategory('')
        window.location.reload()
      } else {
        setError(result.error || '添加失败，请重试')
      }
    } catch (e: any) {
      console.error('addTodo exception:', e)
      setError('添加异常: ' + (e?.message || String(e)))
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <div className="form-row">
        <input
          type="text"
          name="title"
          placeholder="输入待办事项..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          disabled={isSubmitting}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input category-select"
          disabled={isSubmitting}
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? '添加中...' : '添加'}
        </button>
      </div>
      <input
        type="text"
        name="description"
        placeholder="描述（可选）"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input input-desc"
        disabled={isSubmitting}
      />
      {error && <p className="error">{error}</p>}
    </form>
  )
}
