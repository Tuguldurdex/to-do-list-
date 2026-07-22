import { queryOptions } from "@tanstack/react-query"
import keys from "./keys"
import type { MyRoom } from "./types"
import { BackApi } from "@/data"

export const getMyRooms = () => {
  return queryOptions({
    queryKey: keys.getMyRoomsKey(),
    queryFn: async (): Promise<Array<MyRoom>> => await BackApi.get('/rooms/my-rooms')
      .then((res) => res.data)
  })
}