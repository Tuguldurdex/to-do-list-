import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Checkbox, Label, Input, cn } from 'uilab-core'

interface Todo {
  id: number
  text: string
  completed: boolean
  deadline: string  // шинэ талбар
}

export const Route = createFileRoute('/todolist')({
  component: RouteComponent,
})

function RouteComponent() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [deadline, setDeadline] = useState('')  // шинэ state

  const add = () => {
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now(), text: input, completed: false, deadline }])
    setInput('')
    setDeadline('')  // цэвэрлэх
  }

  const toggle = (id: number) =>
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))

  const remove = (id: number) =>
    setTodos(todos.filter(t => t.id !== id))

  // Deadline-ийн өнгө тодорхойлох функц
  const getDeadlineColor = (deadline: string, completed: boolean) => {
    if (completed) return 'text-muted-foreground'
    if (!deadline) return 'text-muted-foreground'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dl = new Date(deadline)
    const diffDays = Math.ceil((dl.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return 'text-red-500 font-semibold'      // хугацаа өнгөрсөн
    if (diffDays <= 2) return 'text-orange-500 font-semibold'  // 2 хоногийн дотор
    return 'text-green-600'                                     // цаг бий
  }

  const formatDeadline = (deadline: string) => {
    if (!deadline) return null
    const dl = new Date(deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((dl.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const dateStr = dl.toLocaleDateString('mn-MN')
    if (diffDays < 0) return `${dateStr} (${Math.abs(diffDays)} хоног хэтэрсэн!)`
    if (diffDays === 0) return `${dateStr} (Өнөөдөр!)`
    if (diffDays === 1) return `${dateStr} (Маргааш)`
    return `${dateStr} (${diffDays} хоног үлдсэн)`
  }

  return (
    <div className="w-md my-10 mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">
        Todo List
      </h1>

      {/* Input */}
      <div className="flex gap-2 mb-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Шинэ даалгавар..."
        />
        <Button onClick={add}>
          Нэмэх
        </Button>
      </div>

      {/* Deadline оруулах */}
      <div className="mb-4">
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          className="border border-input rounded-md px-3 py-2 text-sm w-full"
        />
      </div>

      {/* Empty state */}
      {todos.length === 0 && (
        <div className="text-center text-muted-foreground mt-16">
          <p>Даалгавар алга. Шинээр нэмж болно шүү!</p>
        </div>
      )}

      {/* Todo items */}
      {todos.map(todo => (
        <div
          key={todo.id}
          className="flex items-center gap-3 border border-card rounded-lg mb-2 shadow px-4 py-3"
        >
          <Checkbox
            id={`todo-${todo.id}`}
            name={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={() => toggle(todo.id)}
          />

          <div className="flex flex-col flex-1">
            <Label
              htmlFor={`todo-${todo.id}`}
              className={cn(
                "cursor-pointer text-sm",
                todo.completed ? "text-muted-foreground line-through" : "text-foreground"
              )}
            >
              {todo.text}
            </Label>

            {/* Deadline харуулах */}
            {todo.deadline && (
              <span className={cn("text-xs mt-0.5", getDeadlineColor(todo.deadline, todo.completed))}>
                 {formatDeadline(todo.deadline)}
              </span>
            )}
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => remove(todo.id)}
          >
            Устгах
          </Button>
        </div>
      ))}

      {/* Clear all */}
      {todos.length > 0 && (
        <Button
          className="w-full mt-2"
          variant="destructive"
          onClick={() => setTodos([])}
        >
          Бүгдийг устгах
        </Button>
      )}
    </div>
  )
}