import { queryOptions } from "@tanstack/react-query"
import keys from "./keys"
import type { Todo } from "@/routes/todolist/-components/types"
import { BackApi } from "@/data"

export const getTodoById = (id: string) => {
  return queryOptions({
    queryKey: keys.getTodoByIdKey(id),
    queryFn: async () => await BackApi.get(`/todos/${id}`)
      .then((res) => res.data)
  })
}

export const getTodos = () => {
  return queryOptions({
    queryKey: keys.getTodosKey(),
    queryFn: async (): Promise<Array<Todo>> => await BackApi.get('/todos')
      .then((res) => res.data)
  })
}
