import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export function connectSocket(): Socket {
  if (socket) return socket
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token: localStorage.getItem('accessToken') },
  })
  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
}
