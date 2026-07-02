import { Link, createFileRoute } from '@tanstack/react-router'
import { format, formatDistanceToNow } from 'date-fns'
import { mn } from 'date-fns/locale'
import { Badge, Button, Card, CardContent, CardHeader, cn } from 'uilab-core'
import { useQuery } from '@tanstack/react-query'
import { CreateTodoSheet } from './-components/create-todo-sheet'
import type { Todo } from './-components/types'
import { getTodoById, useUpdateTodo } from '@/data/todos'

export const Route = createFileRoute('/todolist/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data, isLoading } = useQuery(getTodoById(id))
  const { mutateAsync, isPending } = useUpdateTodo(id)

  const handleEditSave = async (updated: Todo) => {
    await mutateAsync({
      title: updated.title,
      completed: updated.completed,
      description: updated.description,
      priority: updated.priority,
      deadline: updated.deadline,
    })
  }

  const getDeadlineColor = (deadline: Date, completed: boolean) => {
    if (completed) return 'text-muted-foreground'
    const diffDays = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return 'text-red-500'
    if (diffDays <= 2) return 'text-orange-500'
    return 'text-green-600'
  }

  const priorityOptions = [
    { value: 'low', label: 'Бага', color: 'border-green-500 bg-green-50 text-green-700' },
    { value: 'medium', label: 'Дунд', color: 'border-orange-400 bg-orange-50 text-orange-700' },
    { value: 'high', label: 'Өндөр', color: 'border-red-500 bg-red-50 text-red-700' },
  ] as const

  if (isLoading || isPending) return <p className="text-center mt-20">Уншиж байна...</p>

  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 my-10">
        <p className="text-muted-foreground">Даалгавар олдсонгүй.</p>
        <Link to="/todolist">
          <Button variant="outline" className="mt-4">← Буцах</Button>
        </Link>
      </div>
    )
  }

  const priority = priorityOptions.find(p => p.value === data.priority) ?? priorityOptions[1]

  return (
    <div className="max-w-md mx-auto px-4 my-10">
      <div className="flex justify-between items-center mb-6">
        <Link to="/todolist">
          <Button variant="outline">← Буцах</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <h1 className={cn(
            "text-2xl font-bold leading-tight",
            data.completed ? "line-through text-muted-foreground" : "text-foreground"
          )}>
            {data.title}
          </h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-24">Чухлын зэрэг</span>
            <Badge className={priority.color}>{priority.label}</Badge>
          </div>

          {data.deadline && (
            <div className="flex items-start gap-2">
              <span className="text-sm text-muted-foreground w-24">Deadline</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {format(new Date(data.deadline), 'yyyy оны MM сарын dd', { locale: mn })}
                </span>
                <span className={cn("text-xs mt-0.5", getDeadlineColor(new Date(data.deadline), data.completed))}>
                  {formatDistanceToNow(new Date(data.deadline), { addSuffix: true, locale: mn })}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Тайлбар</span>
            {data.description ? (
              <p className="text-sm bg-muted rounded-md px-3 py-2 leading-relaxed">{data.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Тайлбар байхгүй</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-24">Үүсгэсэн</span>
            <span className="text-sm">{data.createdAt ? format(new Date(data.createdAt), 'yyyy-MM-dd HH:mm') : '-'}</span>
          </div>

          <hr className="border-border" />

          <CreateTodoSheet
            initialData={data}
            onSubmit={handleEditSave}
            trigger={<Button className="w-full">Засах</Button>}
          />
        </CardContent>
      </Card>
    </div>
  )
}