import { getTodos } from './actions'
import TodoItem from './components/TodoItem'
import AddTodoForm from './components/AddTodoForm'
import './globals.css'

export default async function Home({ searchParams }: { searchParams: Promise<{ filter?: string, search?: string }> }) {
  const { filter, search } = await searchParams
  const todos = await getTodos()
  
  let filtered = todos
  if (filter) {
    filtered = filtered.filter(t => t.category === filter)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(q) || 
      (t.description && t.description.toLowerCase().includes(q))
    )
  }

  const categories = ['工作', '学习', '生活']
  
  const buildUrl = (f?: string, s?: string) => {
    const parts: string[] = []
    if (f) parts.push(`filter=${encodeURIComponent(f)}`)
    if (s) parts.push(`search=${encodeURIComponent(s)}`)
    return parts.length > 0 ? `/?${parts.join('&')}` : '/'
  }

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

      <div className="search-bar">
        <form action="/" method="GET" className="search-form">
          {filter && <input type="hidden" name="filter" value={filter} />}
          <input
            type="text"
            name="search"
            placeholder="🔍 搜索任务标题或描述..."
            defaultValue={search || ''}
            className="input search-input"
          />
          <button type="submit" className="btn-small btn-primary">搜索</button>
          {search && (
            <a href={buildUrl(filter, undefined)} className="btn-small">清除</a>
          )}
        </form>
      </div>

      <div className="filter-bar">
        <span className="filter-label">筛选:</span>
        <a href={buildUrl(undefined, search)} className={!filter ? 'filter-btn active' : 'filter-btn'}>全部</a>
        {categories.map(cat => (
          <a
            key={cat}
            href={buildUrl(cat, search)}
            className={filter === cat ? `filter-btn active filter-${cat}` : `filter-btn filter-${cat}`}
          >
            {cat}
          </a>
        ))}
      </div>

      <div className="todo-list">
        {filtered.length === 0 ? (
          <p className="empty">
            <span className="empty-icon">📝</span>
            {search ? `没有匹配「${search}」的结果` : filter ? `没有「${filter}」类的待办事项` : '还没有待办事项，添加一个吧！'}
          </p>
        ) : (
          filtered.map(todo => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
    </main>
  )
}
