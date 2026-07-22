import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import keys from "./keys"
import type { Todo } from "@/routes/todolist/-components/types"
import { BackApi } from "@/data"

export const useUpdateTodo = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async (todoData: Partial<Todo>) =>
      await BackApi.put(`/todos/${id}`, todoData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.getTodoByIdKey(id) })
      client.invalidateQueries({ queryKey: keys.getTodosKey() })
      toast.success("Даалгавар амжилттай шинэчлэгдлээ")
    },
    onError: () => {
      toast.error("Шинэчлэхэд алдаа гарлаа")
    },
  })
}

export const useToggleTodo = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) =>
      await BackApi.put(`/todos/${id}`, { completed }).then((res) => res.data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.getTodosKey() })
    },
    onError: () => {
      toast.error("Даалгаврын төлөв өөрчлөхөд алдаа гарлаа")
    },
  })
}

export const useCreateTodo = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async (todo: Partial<Todo>) =>
      await BackApi.post('/todos', todo).then((res) => res.data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.getTodosKey() })
      toast.success("Даалгавар нэмэгдлээ")
    },
    onError: () => {
      toast.error("Даалгавар нэмэхэд алдаа гарлаа")
    },
  })
}

export const useDeleteTodo = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => await BackApi.delete(`/todos/${id}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.getTodosKey() })
      toast.success("Даалгавар устгагдлаа")
    },
    onError: () => {
      toast.error("Даалгавар устгахад алдаа гарлаа")
    },
  })
}

export const useDeleteAllTodos = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async (ids: Array<number>) =>
      await Promise.all(ids.map((id) => BackApi.delete(`/todos/${id}`))),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.getTodosKey() })
      toast.success("Бүх даалгавар устгагдлаа")
    },
    onError: () => {
      toast.error("Устгах явцад алдаа гарлаа. Хуудсаа шинэчлээд дахин үзнэ үү.")
    },
  })
}
