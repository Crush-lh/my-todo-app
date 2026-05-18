export interface Todo {
  id: string
  title: string
  description?: string
  category?: string
  completed: boolean
  created_at: string
  updated_at?: string
}