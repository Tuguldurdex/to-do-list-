export interface ChatRoom {
  id: string
  name: string
}

export interface ChatMessage {
  id: string
  roomId: string
  senderId: number
  senderEmail: string
  senderUsername: string
  text: string
  createdAt: string
}