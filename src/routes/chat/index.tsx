import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from 'uilab-core'
import { LogIn, PlusCircle, Trash2 } from 'lucide-react'
import { useCreateRoom } from '@/socket/hooks'
import { getMyRooms, useDeleteRoom } from '@/data/rooms'

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { createRoom, isCreating } = useCreateRoom()
  const [roomName, setRoomName] = useState('')
  const [joinRoomId, setJoinRoomId] = useState('')
  const { data: recentRooms = [], isLoading: isLoadingRooms } = useQuery(getMyRooms())
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom()

  const handleCreate = async () => {
    if (!roomName.trim()) {
      toast.error('Room-ы нэрээ оруулна уу')
      return
    }
    try {
      const room = await createRoom(roomName.trim())
      navigate({ to: '/chat/$roomId', params: { roomId: room.id } })
    } catch {
    }
  }
  
  const handleJoin = () => {
    if (!joinRoomId.trim()) {
      toast.error('Room ID-гаа оруулна уу')
      return
    }
    navigate({ to: '/chat/$roomId', params: { roomId: joinRoomId.trim() } })
  }

  return (
    <div className="max-w-lg mx-auto my-10 px-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Chat</h1>

      <Card>
        <CardHeader>
          <CardTitle>Шинэ room үүсгэх</CardTitle>
          <CardDescription>Room үүсгэсний дараа ID-г бусадтай хуваалцаж болно</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="room-name">Room-ы нэр</Label>
            <Input
              id="room-name"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? 'Үүсгэж байна...' : 'Room үүсгэх'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Room-д нэгдэх</CardTitle>
          <CardDescription>Хэн нэгний өгсөн Room ID-г буулгана уу</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="room-id">Room ID</Label>
            <Input
              id="room-id"
              value={joinRoomId}
              onChange={e => setJoinRoomId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
            />
          </div>
          <Button variant="outline" onClick={handleJoin}>
            Нэгдэх
          </Button>
        </CardContent>
      </Card>

      {isLoadingRooms && (
        <p className="text-sm text-muted-foreground">Ачааллаж байна...</p>
      )}

      {!isLoadingRooms && recentRooms.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label>Саяхан орсон</Label>
          {recentRooms.map(r => (
            <div key={r.id} className="flex items-center gap-1">
              <Button
                variant="ghost"
                className="justify-between flex-1"
                onClick={() => navigate({ to: '/chat/$roomId', params: { roomId: r.id } })}
              >
                <span className="flex items-center gap-2 truncate">
                  {r.isCreator ? (
                    <PlusCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  ) : (
                    <LogIn className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span className="truncate">{r.name}</span>
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {r.isCreator ? 'Үүсгэсэн' : 'Нэгдсэн'}
                </span>
              </Button>

              {r.isCreator && (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  aria-label="Room устгах"
                  onClick={() => deleteRoom(r.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}