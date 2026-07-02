import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger, Button,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from 'uilab-core'
import {
  DndContext, KeyboardSensor, PointerSensor,
  closestCenter, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Search } from 'lucide-react'
import axios from "axios"
import { CreateTodoSheet, SortableTodoCard } from './-components/types'
import type { DragEndEvent } from '@dnd-kit/core'
import type { Todo } from './-components/types'

export const Route = createFileRoute('/todolist/')({
  component: RouteComponent,
})

// Token-тай axios instance үүсгэх
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const [todos, setTodos] = useState<Array<Todo>>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Backend-аас todo-нуудыг авах
  useEffect(() => {
    api.get('/todos')
      .then((res) => setTodos(res.data))
      .catch(() => navigate({ to: '/login' }))
      .finally(() => setIsLoading(false))
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTodos(prev => {
        const oldIndex = prev.findIndex(t => t.id === active.id)
        const newIndex = prev.findIndex(t => t.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const filtered = useMemo(() =>
    todos.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase())
    ), [todos, search])

  const toggle = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    const updated = await api.put(`/todos/${id}`, {
      title: todo.title,
      completed: !todo.completed,
      description: todo.description,
      priority: todo.priority,
      deadline: todo.deadline,
    })
    setTodos(todos.map(t => t.id === id ? updated.data : t))
  }

  const handleRemove = async (id: number) => {
    await api.delete(`/todos/${id}`)
    setTodos(todos.filter(t => t.id !== id))
  }

  const handleAdd = async (todo: Todo) => {
    const res = await api.post('/todos', { 
    title: todo.title ,
    description: todo.description,
    priority: todo.priority,
    deadline: todo.deadline,
    })
    setTodos(prev => [...prev, res.data])
  }

  if (isLoading) {
    return <p>LOADING...</p>
  }

  return (
    <div className="w-md my-10 mx-auto px-4">

      {/* Header */}
      <div className="flex justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <CreateTodoSheet onSubmit={handleAdd} />
      </div>

      {/* Search */}
      <InputGroup className="mb-4">
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          placeholder="Хайх..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </InputGroup>

      {/* Empty state */}
      {todos.length === 0 && (
        <div className="text-center text-muted-foreground mt-16">
          <p>Даалгавар алга. Шинээр нэмж болно шүү!</p>
        </div>
      )}

      {/* Search empty state */}
      {filtered.length === 0 && todos.length > 0 && (
        <div className="text-center text-muted-foreground mt-10 text-sm">
          Хайлтад тохирох даалгавар олдсонгүй.
        </div>
      )}

      {/* Todo list with DnD */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filtered.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {filtered.map(todo => (
            <SortableTodoCard
              key={todo.id}
              todo={todo}
              onToggle={toggle}
              onRemove={handleRemove}
              onNavigate={(id: number) => navigate({ to: '/todolist/$id', params: { id: id.toString() } })}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Delete all */}
      {todos.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger render={
            <Button className="w-full mt-2" variant="destructive">
              Бүгдийг устгах
            </Button>
          } />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Бүгдийг устгах уу?</AlertDialogTitle>
              <AlertDialogDescription>
                Нийт {todos.length} даалгаврыг бүгдийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Болих</AlertDialogCancel>
              <AlertDialogAction onClick={() => api.delete('/todos').then(() => setTodos([]))}>
                Бүгдийг устгах
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}