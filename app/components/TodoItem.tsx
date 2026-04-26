'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { toggleTodo, deleteTodo, updateTodo } from '../actions'

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDesc, setEditDesc] = useState(todo.description || '')
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
    const result = await updateTodo(todo.id, editTitle, editDesc)
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
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="checkbox"
        />
        <div className="todo-text">
          <span className="todo-title">{todo.title}</span>
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
