import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Checkbox, Label, Input, cn } from 'uilab-core'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export const Route = createFileRoute('/todolist')({
  component: RouteComponent,
})

function RouteComponent() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const add = () => {
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now(), text: input, completed: false }])
    setInput('')
  }
  
  const toggle = (id: number) =>
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))

  const remove = (id: number) =>
    setTodos(todos.filter(t => t.id !== id))

  return (
    <div className="w-md my-10 mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">
         Todo List
      </h1>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Шинэ даалгавар..."
        />
        {/* UILab Button */}
        <Button onClick={add}>
           Нэмэх
        </Button>
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
          {/* UILab Checkbox */}
          <Checkbox
            id={`todo-${todo.id}`}
            name={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={() => toggle(todo.id)}
          />

          {/* UILab Label */}
          <Label
            htmlFor={`todo-${todo.id}`}
            className={cn(
              "cursor-pointer text-sm flex-1",
              todo.completed ? "text-muted-foreground line-through" : "text-foreground no-underline"
            )}
          >
            {todo.text}
          </Label>

          {/* UILab Delete Button */}
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
          className="w-full"
          variant="destructive"
          onClick={() => setTodos([])}
        >
           Бүгдийг устгах
        </Button>
      )}
    </div>
  )
}

