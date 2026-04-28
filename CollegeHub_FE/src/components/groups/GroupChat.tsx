import { useRef, useEffect, useState } from "react"
import {
  PaperPlaneTiltIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuthMe } from "@/hooks/use-auth"
import { useGroupChat } from "@/hooks/use-group-chat"
import type { Group } from "@/hooks/use-groups"
import type { ChatMessage } from "@/hooks/use-group-chat"

type GroupChatProps = {
  group: Group
  className?: string
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}

function MessageBubble({
  msg,
  isOwn,
  onEdit,
  onDelete,
}: {
  msg: ChatMessage
  isOwn: boolean
  onEdit?: (messageId: string, message: string) => Promise<void>
  onDelete?: (messageId: string) => Promise<void>
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(msg.message)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSaveEdit = async () => {
    if (!onEdit || editText.trim() === msg.message) {
      setIsEditing(false)
      return
    }
    setIsSaving(true)
    try {
      await onEdit(msg._id, editText)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(msg._id)
      setDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={cn(
        "flex w-full group/message",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[75%] items-start gap-1 rounded-lg px-3 py-2 text-sm",
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <div className="min-w-0 flex-1">
          {!isOwn && (
            <p className="mb-0.5 text-xs font-medium text-muted-foreground">
              {msg.sender?.email ?? "Unknown"}
            </p>
          )}
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-8 resize-none text-sm"
                autoFocus
                disabled={isSaving}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isSaving || !editText.trim()}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap wrap-break-words">{msg.message}</p>
              {msg.isEdited && (
                <span className="text-xs opacity-80"> (edited)</span>
              )}
              <p
                className={cn(
                  "mt-1 text-[8px]",
                  isOwn ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                {formatTime(msg.createdAt)}
              </p>
            </>
          )}
        </div>
        {isOwn && !isEditing && onEdit && onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="opacity-0 group-hover/message:opacity-100 shrink-0 h-6 w-6 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/20"
              >
                <DotsThreeVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setEditText(msg.message)
                  setIsEditing(true)
                }}
              >
                <PencilSimpleIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => {
                  e.preventDefault()
                  setDeleteDialogOpen(true)
                }}
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function GroupChat({ group, className }: GroupChatProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data } = useAuthMe()

  const {
    messages,
    isLoadingHistory,
    error,
    sendMessage,
    editMessage,
    deleteMessage,
  } = useGroupChat(group._id ?? group.socketRoom, true)

  const currentUserId = data?.user?._id ?? data?.user?.id

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
  }

  return (
    <div
      className={cn(
        "flex flex-1 flex-col min-h-0",
        className
      )}
    >
      <header className="shrink-0 border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold">{group.name}</h2>
        <p className="text-xs text-muted-foreground">
          {group.branch} • Year {group.year}
          {group.section ? ` • Section ${group.section}` : ""}
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingHistory && (
            <div className="flex justify-center py-4 text-sm text-muted-foreground">
              Loading messages...
            </div>
          )}

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {!isLoadingHistory && !error && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}

          {!isLoadingHistory && messages.length > 0 && (
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  msg={msg}
                  isOwn={msg.sender?._id === currentUserId}
                  onEdit={editMessage}
                  onDelete={deleteMessage}
                />
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-border p-4"
      >
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            rows={2}
            className="min-h-0 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button type="submit" size="icon" className="shrink-0 self-end">
            <PaperPlaneTiltIcon className="size-4" weight="fill" />
          </Button>
        </div>
      </form>
    </div>
  )
}
