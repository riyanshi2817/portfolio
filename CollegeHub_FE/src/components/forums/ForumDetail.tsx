import { useState } from "react"
import { useNavigate } from "react-router"
import {
  ChatsCircleIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  PencilIcon,
  TrashIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  useForum,
  useForumReplies,
  useDeleteForum,
  useAddReply,
  useEditReply,
  useDeleteReply,
  useForumLike,
  useForumDislike,
  useReplyLike,
  useReplyDislike,
} from "@/hooks/use-forums"
import { useAuthMe } from "@/hooks/use-auth"
import type { ForumReply } from "@/hooks/use-forums"

type ForumDetailProps = {
  forumId: string
  onDelete?: (id: string) => void
  className?: string
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

function ReplyItem({
  reply,
  forumId,
  onEditSuccess,
}: {
  reply: ForumReply
  forumId: string
  onEditSuccess?: () => void
}) {
  const { data: authData } = useAuthMe()
  const isAuthor = authData?.user?._id === reply.author?._id
  const isFacultyOrAdmin = authData?.user?.role === "FACULTY" || authData?.user?.role === "ADMIN"
  const canEditDelete = isAuthor || isFacultyOrAdmin

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const editMutation = useEditReply(reply._id)
  const deleteMutation = useDeleteReply(reply._id, forumId)
  const likeMutation = useReplyLike(reply._id, forumId)
  const dislikeMutation = useReplyDislike(reply._id, forumId)

  const handleSaveEdit = async () => {
    const trimmed = editContent.trim()
    if (!trimmed || trimmed === reply.content) {
      setIsEditing(false)
      setEditContent(reply.content)
      return
    }
    try {
      await editMutation.mutateAsync(trimmed)
      toast.success("Reply updated")
      setIsEditing(false)
      onEditSuccess?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update reply")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync()
      toast.success("Reply deleted")
      setDeleteDialogOpen(false)
      onEditSuccess?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete reply")
    }
  }

  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      <div className="size-8 shrink-0 rounded-full bg-muted flex items-center justify-center">
        <span className="text-xs font-medium text-muted-foreground">
          {(reply.author?.name ?? reply.author?.email ?? "?")[0].toUpperCase()}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">
            {reply.author?.name ?? reply.author?.email ?? "Anonymous"}
          </span>
          <span className="text-xs text-muted-foreground">
            {reply.createdAt && formatDate(reply.createdAt)}
          </span>
          {reply.isEdited && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              Edited
            </Badge>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit} disabled={editMutation.isPending}>
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(reply.content)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{reply.content}</p>
        )}
        {!isEditing && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
            >
              <ThumbsUpIcon
                className="size-3.5"
                weight={reply.userLiked ? "fill" : "regular"}
              />
              {reply.likesCount ?? 0}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => dislikeMutation.mutate()}
              disabled={dislikeMutation.isPending}
            >
              <ThumbsDownIcon
                className="size-3.5"
                weight={reply.userDisliked ? "fill" : "regular"}
              />
              {reply.dislikesCount ?? 0}
            </Button>
            {canEditDelete && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilIcon className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={deleteMutation.isPending}
                >
                  <TrashIcon className="size-3" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete reply</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reply? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function ForumDetail({ forumId, onDelete, className }: ForumDetailProps) {
  const navigate = useNavigate()
  const { data: authData } = useAuthMe()
  const isFacultyOrAdmin = authData?.user?.role === "FACULTY" || authData?.user?.role === "ADMIN"

  const { data: forumData, isLoading, error } = useForum(forumId)
  const { data: repliesData } = useForumReplies(forumId, { page: 1, limit: 50 })
  const deleteForum = useDeleteForum()
  const addReply = useAddReply(forumId)
  const likeForum = useForumLike(forumId)
  const dislikeForum = useForumDislike(forumId)

  const [replyContent, setReplyContent] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const forum = forumData
  const replies = repliesData?.replies ?? []
  const canDeleteForum =
    forum && (forum.createdBy?._id === authData?.user?._id || isFacultyOrAdmin)

  const handleDeleteForum = async () => {
    try {
      await deleteForum.mutateAsync(forumId)
      toast.success("Discussion deleted")
      setDeleteDialogOpen(false)
      onDelete?.(forumId)
      navigate("/community/discussion")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete discussion")
    }
  }

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = replyContent.trim()
    if (!trimmed) return
    try {
      await addReply.mutateAsync(trimmed)
      setReplyContent("")
      toast.success("Reply added")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add reply")
    }
  }

  if (isLoading) {
    return (
      <div className={cn("flex flex-1 items-center justify-center text-muted-foreground", className)}>
        <p className="text-sm">Loading discussion...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-2 text-destructive",
          className
        )}
      >
        <p className="text-sm font-medium">
          {error instanceof Error ? error.message : "Failed to load discussion"}
        </p>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error && error.message.includes("not found")
            ? "This discussion may have been deleted."
            : "Please try again later."}
        </p>
      </div>
    )
  }

  if (!forum) {
    return null
  }

  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)}>
      <div className="mx-auto max-w-3xl w-full space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="size-16 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <ChatsCircleIcon className="size-8 text-primary" weight="duotone" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{forum.title}</h1>
                {forum.topic && (
                  <Badge variant="secondary" className="capitalize">
                    {forum.topic}
                  </Badge>
                )}
              </div>
              {forum.createdBy && (
                <p className="text-sm text-muted-foreground mt-1">
                  by {forum.createdBy.name ?? forum.createdBy.email}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant={forum.userLiked ? "default" : "outline"}
              size="sm"
              onClick={() => likeForum.mutate()}
              disabled={likeForum.isPending}
              className="gap-2"
            >
              <ThumbsUpIcon className="size-4" weight={forum.userLiked ? "fill" : "regular"} />
              {forum.likesCount ?? 0}
            </Button>
            <Button
              variant={forum.userDisliked ? "default" : "outline"}
              size="sm"
              onClick={() => dislikeForum.mutate()}
              disabled={dislikeForum.isPending}
              className="gap-2"
            >
              <ThumbsDownIcon
                className="size-4"
                weight={forum.userDisliked ? "fill" : "regular"}
              />
              {forum.dislikesCount ?? 0}
            </Button>
            {canDeleteForum && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={deleteForum.isPending}
                className="gap-2"
              >
                <TrashIcon className="size-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {forum.description && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {forum.description}
              </p>
            </CardContent>
          </Card>
        )}

        {forum.tags && forum.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {forum.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Replies ({replies.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {replies.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No replies yet. Be the first!</p>
            ) : (
              <div className="divide-y divide-border">
                {replies.map((reply) => (
                  <ReplyItem key={reply._id} reply={reply} forumId={forumId} />
                ))}
              </div>
            )}

            <form onSubmit={handleAddReply} className="mt-4 pt-4 border-t border-border">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={3}
                className="mb-2"
              />
              <Button type="submit" size="sm" disabled={addReply.isPending || !replyContent.trim()}>
                <PaperPlaneTiltIcon className="size-4 mr-2" />
                {addReply.isPending ? "Posting..." : "Post reply"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete discussion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{forum.title}&quot;? This will remove all
              replies. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteForum}
              disabled={deleteForum.isPending}
            >
              {deleteForum.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
