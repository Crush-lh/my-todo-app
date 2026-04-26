'use client'

import { useState } from 'react'
import { addTodo } from '../actions'

export default function AddTodoForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    setError('')

    const result = await addTodo(title, description)

    if (result.success) {
      setTitle('')
      setDescription('')
    } else {
      setError(result.error || '添加失败')
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <div className="form-row">
        <input
          type="text"
          placeholder="输入待办事项..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? '添加中...' : '添加'}
        </button>
      </div>
      <input
        type="text"
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
