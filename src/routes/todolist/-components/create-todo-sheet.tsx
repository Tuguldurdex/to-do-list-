import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import {
  Button, Calendar, Input, Label,
  Popover, PopoverContent, PopoverTrigger,
  Sheet, SheetContent, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger,
  Textarea,
} from 'uilab-core'
import { CalendarIcon } from 'lucide-react'
import type { Todo } from './types'

const schema = z.object({
  title: z.string().min(1, 'Даалгаврын нэр оруулна уу'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  deadline: z.date().catch(new Date()),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onSubmit: (todo: Todo) => void
  initialData?: Todo
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

const priorityOptions: Array<{ value: 'low' | 'medium' | 'high', label: string, color: string }> = [
  { value: 'low', label: 'Бага', color: 'border-green-500 bg-green-50 text-green-700' },
  { value: 'medium', label: 'Дунд', color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'high', label: 'Өндөр', color: 'border-red-500 bg-red-50 text-red-700' },
]

export function CreateTodoSheet({ onSubmit, initialData, open, onOpenChange, trigger }: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen
  const isEditing = !!initialData

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium' },
  })

  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
      })
      setDeadline(initialData.deadline ? new Date(initialData.deadline) : undefined)
    } else if (isOpen && !initialData) {
      reset({ priority: 'medium', title: '', description: '' })
      setDeadline(undefined)
    }
  }, [isOpen])

  const onValid = (data: FormValues) => {
    onSubmit({
      id: initialData?.id ?? Date.now(),
      title: data.title,
      completed: initialData?.completed ?? false,
      deadline,
      description: data.description ?? '',
      priority: data.priority,
    })
    setOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <SheetTrigger render={<Button>+ Нэмэх</Button>} />
      )}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Даалгавар засах' : 'Шинэ даалгавар'}</SheetTitle>
        </SheetHeader>

        <form id="create-todo-form" onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4 px-6 mt-4">

          {/* Даалгаврын нэр */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="title">Даалгавар</Label>
            <Input
              id="title"
              placeholder="Даалгаврын нэр..."
              autoComplete="off"
              {...register('title')}
            />
            {errors.title && (
              <span className="text-xs text-red-500">{errors.title.message}</span>
            )}
          </div>

          {/* Тайлбар */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Тайлбар</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Дэлгэрэнгүй тайлбар..."
              {...register('description')}
            />
          </div>

          {/* Чухлын зэрэг */}
          <div className="flex flex-col gap-2">
            <Label>Чухлын зэрэг</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {priorityOptions.map(option => (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      onClick={() => field.onChange(option.value)}
                      className={`flex-1 ${field.value === option.value
                        ? option.color
                        : 'border-border text-muted-foreground'
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Deadline */}
          <div className="flex flex-col gap-1">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger render={
                <Button variant="outline" className="w-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? new Date(deadline).toLocaleDateString('mn-MN') : 'Огноо сонгох'}
                </Button>
              } />
              <PopoverContent className="w-auto">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(date: Date) => setDeadline(date)}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>
        </form>

        <SheetFooter>
          <Button type="submit" form="create-todo-form" className="w-full">
            {isEditing ? 'Хадгалах' : 'Нэмэх'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}