import { getTodos } from './actions'
import TodoItem from './components/TodoItem'
import AddTodoForm from './components/AddTodoForm'

export default async function Home() {
  const todos = await getTodos()

  return (
    <main className="container">
      <h1>待办清单</h1>
      <AddTodoForm />
      
      <div className="stats">
        <span>总计: {todos.length}</span>
        <span>已完成: {todos.filter(t => t.completed).length}</span>
        <span>待完成: {todos.filter(t => !t.completed).length}</span>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty">还没有待办事项，添加一个吧！</p>
        ) : (
          todos.map(todo => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
    </main>
  )
}
