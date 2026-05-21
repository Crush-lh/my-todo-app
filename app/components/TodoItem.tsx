'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { toggleTodo, deleteTodo, updateTodo } from '../actions'
import { autoCategorize } from '@/lib/category'

const CATEGORIES = [
  { value: '', label: '无分类' },
  { value: '工作', label: '💼 工作' },
  { value: '学习', label: '📚 学习' },
  { value: '生活', label: '🏠 生活' },
]

function CategoryTag({ category }: { category?: string }) {
  if (!category) return null
  const map: Record<string, string> = {
    '工作': 'tag tag-work',
    '学习': 'tag tag-study',
    '生活': 'tag tag-life',
  }
  return <span className={map[category] || 'tag'}>{category}</span>
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDesc, setEditDesc] = useState(todo.description || '')
  const [editCategory, setEditCategory] = useState(todo.category || '')
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleToggle() {
    await toggleTodo(todo.id, !todo.completed)
  }

  async function handleDelete() {
    if (!confirm('确定要删除这个待办吗？')) return
    setIsDeleting(true)
    await deleteTodo(todo.id)
  }

  async function handleUpdate() {
    // 编辑时重新自动分类
    const autoCategory = autoCategorize(editTitle, editDesc)
    const result = await updateTodo(todo.id, editTitle, editDesc, autoCategory || undefined)
    if (result.success) {
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="input"
        />
        <input
          type="text"
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="input"
          placeholder="描述"
        />
        {/* 自动分类提示 */}
        {(() => {
          const autoCat = autoCategorize(editTitle, editDesc)
          if (autoCat) {
            return (
              <div className="auto-category-hint">
                <span className="hint-label">🤖 自动分类：</span>
                <span className={`tag tag-${autoCat.toLowerCase()}`}>{autoCat}</span>
              </div>
            )
          }
          return null
        })()}
        <div className="actions">
          <button onClick={handleUpdate} className="btn-small btn-primary">保存</button>
          <button onClick={() => setIsEditing(false)} className="btn-small">取消</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className="checkbox"
          />
          <div className="checkbox-custom"></div>
        </div>
        <div className="todo-text">
          <div className="todo-header">
            <span className="todo-title">{todo.title}</span>
            <CategoryTag category={todo.category} />
          </div>
          {todo.description && <span className="todo-desc">{todo.description}</span>}
        </div>
      </div>
      <div className="actions">
        <button onClick={() => setIsEditing(true)} className="btn-small">编辑</button>
        <button onClick={handleDelete} disabled={isDeleting} className="btn-small btn-danger">
          {isDeleting ? '删除中...' : '删除'}
        </button>
      </div>
    </div>
  )
}
