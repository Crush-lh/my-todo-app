import { getTodos } from './actions'
import TodoItem from './components/TodoItem'
import AddTodoForm from './components/AddTodoForm'
import './globals.css'

export default async function Home() {
  const todos = await getTodos()

  return (
    <main className="container">
      <h1>待办清单 <small>v20250517-2040</small></h1>
      <AddTodoForm />
      
      <div className="stats">
        <div className="stat-card">
          <span className="stat-number">{todos.length}</span>
          <span className="stat-label">总计</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{todos.filter(t => t.completed).length}</span>
          <span className="stat-label">已完成</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{todos.filter(t => !t.completed).length}</span>
          <span className="stat-label">待完成</span>
        </div>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty"><span className="empty-icon">📝</span>还没有待办事项，添加一个吧！</p>
        ) : (
          todos.map(todo => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
    </main>
  )
}
