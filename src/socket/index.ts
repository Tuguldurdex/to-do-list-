import { io } from "socket.io-client"
import type { Socket } from "socket.io-client"

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    const token = localStorage.getItem("token")
    socket = io(import.meta.env.VITE_SOCKET_URL ?? import.meta.env.VITE_API_URL, {
      auth: { token },
      autoConnect: false,
      transports: ["websocket"],
    })
  }
  return socket
}

export const connectSocket = () => {
  const s = getSocket()
  s.auth = { token: localStorage.getItem("token") }
  if (!s.connected) {
    s.connect()
  }
  return s
}

export const disconnectSocket = () => {
  socket?.disconnect()
}
