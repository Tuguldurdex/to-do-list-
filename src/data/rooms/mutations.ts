import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import keys from "./keys"
import { BackApi } from "@/data"

export const useDeleteRoom = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: async (roomId: string) =>
      await BackApi.delete(`/rooms/${roomId}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.getMyRoomsKey() })
      toast.success("Room устгагдлаа")
    },
    onError: () => {
      toast.error("Room устгахад алдаа гарлаа")
    },
  })
}