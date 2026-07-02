export interface Todo {

  id: number
  title: string
  completed: boolean
  deadline?: Date
  description: string
  priority: 'low' | 'medium' | 'high'
  createdAt?: string
}

export * from "./sortable-todo-card"
export * from "./create-todo-sheet"