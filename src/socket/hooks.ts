import { useCallback, useEffect, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { SocketEmit, SocketOn } from "./events"
import { getSocket } from "./index"
import type { ChatMessage, ChatRoom } from "./types"
import roomKeys from "@/data/rooms/keys"

export const useCreateRoom = () => {
  const [isCreating, setIsCreating] = useState(false)

  const createRoom = useCallback((name: string): Promise<ChatRoom> => {
    setIsCreating(true)
    return new Promise((resolve, reject) => {
      const socket = getSocket()
      socket.emit(SocketEmit.ROOM_CREATE, { name }, (response: { room?: ChatRoom; error?: string }) => {
        setIsCreating(false)
        if (response.error || !response.room) {
          toast.error(response.error ?? "Room үүсгэхэд алдаа гарлаа")
          reject(response.error)
          return
        }
        resolve(response.room)
      })
    })
  }, [])

  return { createRoom, isCreating }
}

export const useChatRoom = (roomId: string | undefined) => {
  const [messages, setMessages] = useState<Array<ChatMessage>>([])
  const [room, setRoom] = useState<ChatRoom | null>(null)
  const [isJoining, setIsJoining] = useState(true)
  const [presenceNote, setPresenceNote] = useState<string | null>(null)
  const roomIdRef = useRef(roomId)
  roomIdRef.current = roomId
  const hasLeftRef = useRef(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!roomId) return

    hasLeftRef.current = false
    const socket = getSocket()
    setMessages([])
    setRoom(null)
    setIsJoining(true)

    const handleJoined = (payload: { room: ChatRoom; messages: Array<ChatMessage> }) => {
      if (roomIdRef.current !== roomId) return
      setRoom(payload.room)
      setMessages(payload.messages)
      setIsJoining(false)
      queryClient.invalidateQueries({ queryKey: roomKeys.getMyRoomsKey() })
    }

    const handleNewMessage = (message: ChatMessage) => {
      if (message.roomId !== roomId) return
      setMessages(prev => [...prev, message])
    }

    const handleUserJoined = (payload: { roomId: string; email: string }) => {
      if (payload.roomId !== roomId) return
      setPresenceNote(`${payload.email} room-д нэгдлээ`)
    }

    const handleUserLeft = (payload: { roomId: string; email: string }) => {
      if (payload.roomId !== roomId) return
      setPresenceNote(`${payload.email} room-оос гарлаа`)
    }


    socket.on(SocketOn.ROOM_JOINED, handleJoined)
    socket.on(SocketOn.MESSAGE_NEW, handleNewMessage)
    socket.on(SocketOn.USER_JOINED, handleUserJoined)
    socket.on(SocketOn.USER_LEFT, handleUserLeft)
    

    socket.emit(SocketEmit.ROOM_JOIN, { roomId })

    return () => {
      if (!hasLeftRef.current) {
        socket.emit(SocketEmit.ROOM_LEAVE, { roomId })
      }
      socket.off(SocketOn.ROOM_JOINED, handleJoined)
      socket.off(SocketOn.MESSAGE_NEW, handleNewMessage)
      socket.off(SocketOn.USER_JOINED, handleUserJoined)
      socket.off(SocketOn.USER_LEFT, handleUserLeft)
    }
  }, [roomId, queryClient])

  const sendMessage = useCallback((text: string) => {
    if (!roomId || !text.trim()) return
    getSocket().emit(SocketEmit.MESSAGE_SEND, { roomId, text })
  }, [roomId])

  const leaveRoom = useCallback(() => {
    if (!roomId || hasLeftRef.current) return
    hasLeftRef.current = true
    getSocket().emit(SocketEmit.ROOM_LEAVE, { roomId })
  }, [roomId])

  return { room, messages, isJoining, presenceNote, sendMessage, leaveRoom }
}