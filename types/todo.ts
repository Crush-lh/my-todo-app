export interface Todo {
  id: string
  title: string
  description?: string
  category?: string
  priority?: string
  completed: boolean
  created_at: string
  updated_at?: string
}