import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { BackApi } from "@/data"

export const useUpdateTodo = (id: string) => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async (todoData: any) =>
      await BackApi.put(`/todos/${id}`, todoData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['todoById', id] })
      toast.success("Даалгавар амжилттай шинэчлэгдлээ")
    },
  })  
}
