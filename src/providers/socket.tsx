import { useEffect } from "react"
import { connectSocket, disconnectSocket } from "@/socket"

export function SocketProvider() {
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      connectSocket()
    }
    return () => {
      disconnectSocket()
    }
  }, [])

  return null
}