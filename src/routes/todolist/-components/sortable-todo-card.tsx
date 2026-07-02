import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Checkbox,
  Label,
  cn,
} from "uilab-core"
import { differenceInBusinessDays, format, formatDistanceToNow } from "date-fns"
import { mn } from "date-fns/locale"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2 } from "lucide-react"
import type { Todo } from "./types"

interface TodoCardProps {
  todo: Todo
  onToggle: (id: number) => void
  onRemove: (id: number) => void
  onNavigate: (id: number) => void
}

export function SortableTodoCard({
  todo,
  onToggle,
  onRemove,
  onNavigate,
}: TodoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

 const getDeadlineColor = (deadline: Date | string | undefined, completed: boolean) => {
    if (completed) return "text-muted-foreground"
    if (!deadline) return "text-muted-foreground"
    const diffDays = differenceInBusinessDays(new Date(deadline), new Date())
    if (diffDays < 0) return "text-red-500 font-semibold"
    if (diffDays <= 2) return "text-orange-500 font-semibold"
    return "text-green-600"
}
const formatDeadline = (deadline?: Date | string) => {
  if (!deadline) return null
  const date = new Date(deadline)
  const distance = formatDistanceToNow(date, {
    addSuffix: true,
    locale: mn,
  })
  const formattedDeadline = format(date, "yyyy-MM-do hh:mm aaa", {
    locale: mn,
  })
  return `${formattedDeadline} (${distance})`
}

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-card bg-background mb-2 flex items-center gap-3 rounded-lg border px-4 py-3 shadow"
    >
      <Button
        {...attributes}
        {...listeners}
        variant="shadow"
        size="icon"
        className="cursor-grab active:cursor-grabbing"
        tabIndex={-1}
        aria-label="Чирэх"
      >
        <GripVertical className="text-muted-foreground h-4 w-4" />
      </Button>

      <Checkbox
        id={`todo-${todo.id}`}
        name={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Label
          onClick={() => onNavigate(todo.id)}
          className={cn(
            "cursor-pointer truncate text-sm hover:underline",
            todo.completed
              ? "text-muted-foreground line-through"
              : "text-foreground"
          )}
        >
          {todo.title}
        </Label>

        {todo.deadline && (
          <span
            className={cn(
              "mt-0.5 text-xs",
              getDeadlineColor(todo.deadline, todo.completed)
            )}
          >
            {formatDeadline(todo.deadline)}
          </span>
        )}
      </div>

      {todo.completed ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(todo.id)}
        >
          <Trash2></Trash2>
        </Button>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Устгах уу?</AlertDialogTitle>
              <AlertDialogDescription>
                "{todo.title}" даалгаврыг устгахдаа итгэлтэй байна уу?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Болих</AlertDialogCancel>
              <AlertDialogAction onClick={() => onRemove(todo.id)}>
                Устгах
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
