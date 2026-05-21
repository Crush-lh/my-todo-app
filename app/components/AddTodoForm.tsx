'use client'

import { useState } from 'react'
import { addTodo } from '../actions'
import { autoCategorize } from '@/lib/category'

export default function AddTodoForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null)

  // 实时预览自动分类结果
  function handleTitleChange(value: string) {
    setTitle(value)
    if (value.trim()) {
      const category = autoCategorize(value, description)
      setDetectedCategory(category)
    } else {
      setDetectedCategory(null)
    }
  }

  function handleDescChange(value: string) {
    setDescription(value)
    if (title.trim()) {
      const category = autoCategorize(title, value)
      setDetectedCategory(category)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      const result = await addTodo(title, description || undefined)
      console.log('addTodo result:', result)
      if (result.success) {
        setTitle('')
        setDescription('')
        setDetectedCategory(null)
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

  const categoryEmoji: Record<string, string> = {
    '工作': '💼',
    '学习': '📚',
    '生活': '🏠'
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <div className="form-row">
        <input
          type="text"
          name="title"
          placeholder="输入待办事项..."
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="input"
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? '添加中...' : '添加'}
        </button>
      </div>
      <input
        type="text"
        name="description"
        placeholder="描述（可选，帮助更精准分类）"
        value={description}
        onChange={(e) => handleDescChange(e.target.value)}
        className="input input-desc"
        disabled={isSubmitting}
      />
      {/* 自动分类预览 */}
      {detectedCategory && (
        <div className="category-preview">
          <span className="category-preview-label">🤖 自动识别为：</span>
          <span className={`category-badge category-${detectedCategory}`}>
            {categoryEmoji[detectedCategory]} {detectedCategory}
          </span>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </form>
  )
}
