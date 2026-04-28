import { useState } from "react"
import { UsersIcon, DotsThreeVerticalIcon, CrownIcon, UserMinusIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useClubMembers,
  useUpdateMemberRole,
  useRemoveMember,
  useTransferLeadership,
} from "@/hooks/use-clubs"
import { useAuthMe } from "@/hooks/use-auth"
import type { ClubMember } from "@/hooks/use-clubs"

type ClubMembersProps = {
  clubId: string
  canManage: boolean
  canTransferLeadership?: boolean
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

function getInitials(name?: string, email?: string) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }
  return "?"
}

export function ClubMembers({ clubId, canManage, canTransferLeadership = false }: ClubMembersProps) {
  const { data: authData } = useAuthMe()
  const currentUserId = authData?.user?._id ?? authData?.user?.id

  const [page, setPage] = useState(1)
  const limit = 20
  const { data, isLoading } = useClubMembers(clubId, { page, limit })
  const updateRole = useUpdateMemberRole(clubId)
  const removeMember = useRemoveMember(clubId)
  const transferLeadership = useTransferLeadership(clubId)

  const [removeTarget, setRemoveTarget] = useState<ClubMember | null>(null)
  const [transferTarget, setTransferTarget] = useState<ClubMember | null>(null)

  const members = data?.members ?? []
  const totalMembers = data?.totalMembers ?? 0
  const totalPages = Math.ceil(totalMembers / limit) || 1

  const handleRoleChange = (member: ClubMember, newRole: "CO_LEADER" | "MEMBER") => {
    if (member.clubRole === "LEADER") return
    const userId = typeof member.user === "object" ? member.user._id : member.user
    updateRole.mutate(
      { userId, role: newRole },
      {
        onSuccess: () => toast.success("Role updated"),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update role"),
      }
    )
  }

  const handleRemove = async () => {
    if (!removeTarget) return
    const userId = typeof removeTarget.user === "object" ? removeTarget.user._id : removeTarget.user
    try {
      await removeMember.mutateAsync(userId)
      toast.success("Member removed")
      setRemoveTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove member")
    }
  }

  const handleTransfer = async () => {
    if (!transferTarget) return
    const userId = typeof transferTarget.user === "object" ? transferTarget.user._id : transferTarget.user
    try {
      await transferLeadership.mutateAsync(userId)
      toast.success("Leadership transferred")
      setTransferTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to transfer leadership")
    }
  }

  const isLeader = (m: ClubMember) => m.clubRole === "LEADER"

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <UsersIcon className="size-4" weight="duotone" />
          Members ({totalMembers})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-sm text-muted-foreground py-4">Loading members...</p>
        )}

        {!isLoading && members.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No members yet.</p>
        )}

        {!isLoading && members.length > 0 && (
          <ul className="space-y-2">
            {members.map((member) => {
              const user = typeof member.user === "object" ? member.user : { _id: member.user, name: "", email: "" }
              const name = user.name ?? user.email ?? "Unknown"
              const isCurrentUser = String(user._id) === String(currentUserId)
              const canChangeRole = canManage && !isLeader(member)
              const canRemove = canManage && !isLeader(member) && !isCurrentUser
              const canTransfer = canTransferLeadership && !isLeader(member) && !isCurrentUser

              return (
                <li
                  key={user._id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border border-border p-3",
                    isLeader(member) && "border-primary/20 bg-primary/5"
                  )}
                >
                  <div className="size-10 shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {getInitials(name, user.email)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {name}
                      {isCurrentUser && (
                        <span className="text-muted-foreground font-normal ml-1">(you)</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant={member.clubRole === "LEADER" ? "default" : "secondary"}
                        className="text-[10px] capitalize"
                      >
                        {member.clubRole === "LEADER" && (
                          <CrownIcon className="size-3 mr-0.5" weight="fill" />
                        )}
                        {member.clubRole}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Joined {formatDate(member.joinedAt)}
                      </span>
                    </div>
                  </div>
                  {canManage && (canChangeRole || canRemove || canTransfer) && (
                    <div className="flex items-center gap-1 shrink-0">
                      {canChangeRole && (
                        <Select
                          value={member.clubRole}
                          onValueChange={(v) => handleRoleChange(member, v as "CO_LEADER" | "MEMBER")}
                        >
                          <SelectTrigger className="w-[110px] h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="CO_LEADER">Co-Leader</SelectItem>
                              <SelectItem value="MEMBER">Member</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <DotsThreeVerticalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canTransfer && (
                            <DropdownMenuItem
                              onClick={() => setTransferTarget(member)}
                            >
                              <CrownIcon className="size-4" />
                              Transfer leadership
                            </DropdownMenuItem>
                          )}
                          {canRemove && (
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setRemoveTarget(member)}
                            >
                              <UserMinusIcon className="size-4" />
                              Remove member
                            </DropdownMenuItem>
                          )}
                          {!canTransfer && !canRemove && (
                            <DropdownMenuItem disabled>
                              No actions available
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!removeTarget} onOpenChange={(o) => !o && setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              {removeTarget && (typeof removeTarget.user === "object" ? removeTarget.user.name || removeTarget.user.email : "this member")}{" "}
              from the club?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleRemove} disabled={removeMember.isPending}>
              {removeMember.isPending ? "Removing..." : "Remove"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!transferTarget} onOpenChange={(o) => !o && setTransferTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Transfer leadership</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to transfer club leadership to{" "}
              {transferTarget && (typeof transferTarget.user === "object" ? transferTarget.user.name || transferTarget.user.email : "this member")}?
              You will become a regular member.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleTransfer} disabled={transferLeadership.isPending}>
              {transferLeadership.isPending ? "Transferring..." : "Transfer"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
