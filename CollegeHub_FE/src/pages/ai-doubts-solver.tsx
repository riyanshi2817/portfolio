import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  useDoubtChatHistory,
  useSendDoubtChat,
  useClearDoubtChat,
} from "@/hooks/use-doubt-chat"
import type { DoubtChatMessage } from "@/hooks/use-doubt-chat"
import {
  RobotIcon,
  UserIcon,
  PaperPlaneTiltIcon,
  TrashIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

function formatTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

/** Renders text with **bold** and `code` markdown */
function MarkdownText({ content }: { content: string }) {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  const re = /(\*\*(.+?)\*\*|`([^`]+)`)/g
  let match: RegExpExecArray | null
  let key = 0
  while ((match = re.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{content.slice(lastIndex, match.index)}</span>)
    }
    if (match[2] !== undefined) {
      parts.push(<strong key={key++}>{match[2]}</strong>)
    } else if (match[3] !== undefined) {
      parts.push(
        <code key={key++} className="rounded bg-muted px-1 py-0.5 text-xs">
          {match[3]}
        </code>
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < content.length) {
    parts.push(<span key={key}>{content.slice(lastIndex)}</span>)
  }
  return parts.length > 0 ? <>{parts}</> : <>{content}</>
}

function ChatBubble({ message }: { message: DoubtChatMessage }) {
  const isUser = message.role === "user"
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : ""
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary/20" : "bg-muted"
        )}
      >
        {isUser ? (
          <UserIcon className="size-4 text-primary" weight="duotone" />
        ) : (
          <RobotIcon className="size-4 text-muted-foreground" weight="duotone" />
        )}
      </div>
      <div
        className={cn(
          "rounded-lg px-3 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted/80 text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">
          {message.role === "model" ? (
            <MarkdownText content={message.content} />
          ) : (
            message.content
          )}
        </p>
        <p
          className={cn(
            "mt-1 text-xs opacity-70",
            isUser ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[85%]">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <RobotIcon className="size-4 text-muted-foreground" weight="duotone" />
      </div>
      <div className="rounded-lg px-3 py-2 text-sm bg-muted/80">
        <div className="flex items-center gap-1.5">
          <CircleNotchIcon
            className="size-4 animate-spin text-muted-foreground"
            weight="bold"
          />
          <span className="text-muted-foreground">AI is thinking...</span>
        </div>
      </div>
    </div>
  )
}

export function AiDoubtsSolverPage() {
  const [question, setQuestion] = useState("")
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, error } = useDoubtChatHistory()
  const sendMutation = useSendDoubtChat()
  const clearMutation = useClearDoubtChat()

  const messages = data?.messages ?? []
  const isSending = sendMutation.isPending

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isSending])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = question.trim()
    if (!trimmed) return

    setQuestion("")
    setPendingQuestion(trimmed)
    try {
      await sendMutation.mutateAsync(trimmed)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to get answer")
    } finally {
      setPendingQuestion(null)
    }
  }

  const handleClear = async () => {
    try {
      await clearMutation.mutateAsync()
      toast.success("Chat history cleared")
      setClearDialogOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to clear chat")
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2">
      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden pt-0">
        <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-4 border-b py-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <RobotIcon className="size-8 text-primary" weight="duotone" />
            </div>
            <div>
              <CardTitle className="text-xl">Doubts Solver</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Conversational AI tutor. Ask your academic doubts and get instant answers.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setClearDialogOpen(true)}
            disabled={messages.length === 0 || clearMutation.isPending}
            className="gap-2 text-muted-foreground hover:text-destructive"
          >
            <TrashIcon className="size-4" weight="duotone" />
            Clear chat
          </Button>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
            {isLoading && !pendingQuestion ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <p className="text-sm">Loading chat history...</p>
              </div>
            ) : error && !pendingQuestion ? (
              <div className="flex items-center justify-center py-12 text-destructive">
                <p className="text-sm">
                  {error instanceof Error ? error.message : "Failed to load chat"}
                </p>
              </div>
            ) : messages.length === 0 && !pendingQuestion ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <RobotIcon className="size-12 mb-4 opacity-50" weight="duotone" />
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs mt-1 max-w-sm">
                  Ask your academic doubts and the AI tutor will help you understand.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <ChatBubble key={msg._id} message={msg} />
                ))}
                {pendingQuestion && (
                  <>
                    <ChatBubble
                      message={{
                        _id: "pending-user",
                        role: "user",
                        content: pendingQuestion,
                        createdAt: new Date().toISOString(),
                      }}
                    />
                    <TypingIndicator />
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex shrink-0 gap-2">
            <Textarea
              placeholder="Ask your doubt..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(e)
                }
              }}
              disabled={sendMutation.isPending}
              className="min-h-0 resize-none py-2"
              rows={2}
            />
            <Button
              type="submit"
              disabled={!question.trim() || sendMutation.isPending}
              className="shrink-0"
            >
              {sendMutation.isPending ? (
                <CircleNotchIcon className="size-4 animate-spin" weight="bold" />
              ) : (
                <PaperPlaneTiltIcon className="size-4" weight="duotone" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all messages in this chat. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleClear}
              disabled={clearMutation.isPending}
            >
              {clearMutation.isPending ? "Clearing..." : "Clear"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
