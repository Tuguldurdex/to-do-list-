export const SocketEmit = {
  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  ROOM_LEAVE: "room:leave",
  MESSAGE_SEND: "message:send",
} as const

export const SocketOn = {
  ROOM_CREATED: "room:created",
  ROOM_JOINED: "room:joined",
  ROOM_LEFT: "room:left",
  MESSAGE_NEW: "message:new",
  USER_JOINED: "user:joined", 
  USER_LEFT: "user:left",
  ERROR: "error",
} as const