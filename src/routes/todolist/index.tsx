import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { CreateTodoSheet, SortableTodoCard } from './-components/types'
import type { DragEndEvent } from '@dnd-kit/core'
import type { Todo } from './-components/types'
import { getTodos, useCreateTodo, useDeleteAllTodos, useDeleteTodo, useToggleTodo } from '@/data/todos'

export const Route = createFileRoute('/todolist/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState<Array<number> | null>(null)

  const { data: todos = [], isLoading } = useQuery(getTodos())
  const toggleMutation = useToggleTodo()
  const createMutation = useCreateTodo()
  const deleteMutation = useDeleteTodo()
  const deleteAllMutation = useDeleteAllTodos()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const orderedTodos = useMemo(() => {
    if (!order) return todos
    const byId = new Map(todos.map(t => [t.id, t]))
    const sorted = order.map(id => byId.get(id)).filter((t): t is Todo => !!t)
    const missing = todos.filter(t => !order.includes(t.id))
    return [...sorted, ...missing]
  }, [todos, order])

  const filtered = useMemo(() =>
    orderedTodos.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase())
    ), [orderedTodos, search])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const current = orderedTodos.map(t => t.id)
      const oldIndex = current.indexOf(active.id as number)
      const newIndex = current.indexOf(over.id as number)
      setOrder(arrayMove(current, oldIndex, newIndex))
    }
  }

  if (isLoading) {
    return <p>Уншиж байна...</p>
  }

  return (
    <div className="w-md my-10 mx-auto px-4">

      {/* Header */}
      <div className="flex justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <CreateTodoSheet onSubmit={(todo) => createMutation.mutate(todo)} />
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
              onToggle={(id) => toggleMutation.mutate({ id, completed: !todo.completed })}
              onRemove={(id) => deleteMutation.mutate(id)}
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
              <AlertDialogAction onClick={() => deleteAllMutation.mutate(todos.map(t => t.id))}>
                Бүгдийг устгах
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
