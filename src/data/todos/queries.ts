import { queryOptions } from "@tanstack/react-query"
import { BackApi } from ".."
import keys from "./keys"

export const getTodoById = (id: string) => {
  return queryOptions({
    queryKey: keys.getTodoByIdKey(id),
    queryFn: async () => await BackApi.get(`/todos/${id}`)
      .then((res) => res.data)
  })
}