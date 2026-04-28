import { io, type Socket } from "socket.io-client"
import { SOCKET_URL } from "./api"

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { withCredentials: true })
  }
  return socket
}

/** Run a callback when the socket is connected. If already connected, runs immediately. */
export function whenConnected(sock: Socket, fn: () => void): () => void {
  if (sock.connected) {
    fn()
    return () => {}
  }
  sock.once("connect", fn)
  return () => sock.off("connect", fn)
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
