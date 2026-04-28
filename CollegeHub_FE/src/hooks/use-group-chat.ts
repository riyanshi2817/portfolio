import { useEffect, useState, useCallback } from "react"
import { getSocket, whenConnected } from "@/lib/socket"
import { apiFetch } from "@/lib/api"

export type ChatMessage = {
  _id: string
  groupId: string
  sender: { _id: string; email: string; role: string }
  message: string
  isEdited: boolean
  createdAt: string
  updatedAt: string
}

type ChatHistoryResponse = {
  total: number
  page: number
  limit: number
  messages: ChatMessage[]
}

function normalizeId(id: unknown): string {
  if (typeof id === "string") return id
  if (id && typeof id === "object") {
    const o = id as Record<string, unknown>
    if ("$oid" in o && typeof o.$oid === "string") return o.$oid
    if ("_id" in o) return String(o._id)
  }
  return String(id ?? "")
}

function toChatMessage(raw: unknown): ChatMessage | null {
  if (!raw || typeof raw !== "object") return null
  const m = raw as Record<string, unknown>
  const _id = normalizeId(m._id)
  const groupId = normalizeId(m.groupId)
  const message = typeof m.message === "string" ? m.message : ""
  const sender = m.sender && typeof m.sender === "object"
    ? {
        _id: normalizeId((m.sender as Record<string, unknown>)._id),
        email: String((m.sender as Record<string, unknown>).email ?? ""),
        role: String((m.sender as Record<string, unknown>).role ?? ""),
      }
    : { _id: "", email: "Unknown", role: "" }
  const createdAt = m.createdAt instanceof Date
    ? m.createdAt.toISOString()
    : String(m.createdAt ?? "")
  const updatedAt = m.updatedAt instanceof Date
    ? m.updatedAt.toISOString()
    : String(m.updatedAt ?? createdAt)
  return {
    _id,
    groupId,
    sender,
    message,
    isEdited: Boolean(m.isEdited),
    createdAt,
    updatedAt,
  }
}

export function useGroupChat(groupId: string | null, enabled: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    (message: string) => {
      if (!groupId || !message.trim()) return
      const socket = getSocket()
      whenConnected(socket, () => {
        socket.emit("sendMessage", { groupId, message: message.trim() })
      })
    },
    [groupId]
  )

  useEffect(() => {
    if (!groupId || !enabled) return

    const socket = getSocket()
    const groupIdStr = normalizeId(groupId)

    const loadHistory = async () => {
      setIsLoadingHistory(true)
      setError(null)
      try {
        const data = await apiFetch<ChatHistoryResponse>(
          `/groups/${groupId}/chat?page=1&limit=50`
        )
        setMessages(data.messages ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load messages")
        setMessages([])
      } finally {
        setIsLoadingHistory(false)
      }
    }

    loadHistory()

    const joinGroup = () => socket.emit("joinGroup", { groupId: groupIdStr })
    if (socket.connected) {
      joinGroup()
    }
    socket.on("connect", joinGroup)

    const onNewMessage = (raw: unknown) => {
      const msg = toChatMessage(raw)
      if (!msg) return
      const msgGroupId = normalizeId(msg.groupId)
      if (msgGroupId === groupIdStr) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev
          return [...prev, msg]
        })
      }
    }

    socket.on("newMessage", onNewMessage)
    socket.on("receiveMessage", onNewMessage)

    return () => {
      socket.off("newMessage", onNewMessage)
      socket.off("receiveMessage", onNewMessage)
      socket.off("connect", joinGroup)
      socket.emit("leaveGroup", { groupId: groupIdStr })
    }
  }, [groupId, enabled])

  const editMessage = useCallback(
    async (messageId: string, message: string) => {
      if (!message.trim()) return
      const res = await apiFetch<{ data: unknown }>(`/chat/${messageId}`, {
        method: "PUT",
        body: JSON.stringify({ message: message.trim() }),
      })
      const updated = toChatMessage(res.data)
      if (updated) {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? updated : m))
        )
      }
    },
    []
  )

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await apiFetch(`/chat/${messageId}`, { method: "DELETE" })
      setMessages((prev) => prev.filter((m) => m._id !== messageId))
    } catch (err) {
      throw err
    }
  }, [])

  return {
    messages,
    isLoadingHistory,
    error,
    sendMessage,
    editMessage,
    deleteMessage,
  }
}
