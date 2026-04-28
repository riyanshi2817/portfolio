import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthMe } from "@/hooks/use-auth"
import {
  useClub,
  useDeleteClub,
  useJoinClub,
  useLeaveClub,
} from "@/hooks/use-clubs"
import { cn } from "@/lib/utils"
import {
  PencilIcon,
  SignInIcon,
  SignOutIcon,
  TrashIcon,
  TreeStructureIcon,
} from "@phosphor-icons/react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { ClubForm } from "./ClubForm"
import { ClubMembers } from "./ClubMembers"

type ClubDetailProps = {
	clubId: string
	onEdit?: () => void
	onDelete?: (id: string) => void
	className?: string
}

export function ClubDetail({
	clubId,
	onEdit,
	onDelete,
	className,
}: ClubDetailProps) {
	const navigate = useNavigate()
	const { data: authData } = useAuthMe()
	const { data, isLoading, error } = useClub(clubId)
	const deleteClub = useDeleteClub()
	const joinClub = useJoinClub(clubId)
	const leaveClub = useLeaveClub(clubId)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isEditing, setIsEditing] = useState(false)

	const club = data?.club
	const userRole = authData?.user?.role
	const clubUserRole = club?.userRole
	const canManage =
		clubUserRole === "LEADER" ||
		clubUserRole === "CO_LEADER" ||
		userRole === "ADMIN"
	const isStudent = userRole === "STUDENT"
	const canJoinLeave = isStudent && clubUserRole !== "LEADER"

	const handleDelete = async () => {
		try {
			await deleteClub.mutateAsync(clubId)
			toast.success("Club deleted")
			setDeleteDialogOpen(false)
			onDelete?.(clubId)
			navigate("/clubs")
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to delete club")
		}
	}

	const handleEditSuccess = () => {
		setIsEditing(false)
	}

	const handleJoin = () => {
		joinClub.mutate(undefined, {
			onSuccess: () => toast.success("Joined club"),
			onError: (err) =>
				toast.error(err instanceof Error ? err.message : "Failed to join"),
		})
	}

	const handleLeave = () => {
		leaveClub.mutate(undefined, {
			onSuccess: () => toast.success("Left club"),
			onError: (err) =>
				toast.error(err instanceof Error ? err.message : "Failed to leave"),
		})
	}

	if (isLoading) {
		return (
			<div
				className={cn(
					"flex flex-1 items-center justify-center text-muted-foreground",
					className,
				)}
			>
				<p className="text-sm">Loading club...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div
				className={cn(
					"flex flex-1 flex-col items-center justify-center gap-2 text-destructive",
					className,
				)}
			>
				<p className="text-sm font-medium">
					{error instanceof Error ? error.message : "Failed to load club"}
				</p>
				<p className="text-xs text-muted-foreground">
					{error instanceof Error && error.message.includes("not found")
						? "This club may have been deleted."
						: "Please try again later."}
				</p>
			</div>
		)
	}

	if (!club) {
		return null
	}

	if (isEditing) {
		return (
			<div className={cn("flex-1 overflow-y-auto p-4", className)}>
				<ClubForm
					club={club}
					onSuccess={handleEditSuccess}
					onCancel={() => setIsEditing(false)}
				/>
			</div>
		)
	}

	return (
		<div className={cn("flex-1 overflow-y-auto p-4", className)}>
			<div className="mx-auto max-w-3xl w-full space-y-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-4">
						{club.logo ? (
							<img
								src={club.logo}
								alt=""
								className="size-16 shrink-0 rounded-xl object-cover border border-border"
							/>
						) : (
							<div className="size-16 shrink-0 rounded-xl bg-primary/15 flex items-center justify-center">
								<TreeStructureIcon
									className="size-8 text-primary"
									weight="duotone"
								/>
							</div>
						)}
						<div>
							<h1 className="text-2xl font-bold tracking-tight">{club.name}</h1>
							<div className="flex flex-wrap items-center gap-2 mt-1">
								<Badge variant="secondary" className="capitalize">
									{club.category}
								</Badge>
								<span className="text-sm text-muted-foreground">
									{club.memberCount}{" "}
									{club.memberCount === 1 ? "member" : "members"}
								</span>
							</div>
							{club.tags && club.tags.length > 0 && (
								<div className="flex flex-wrap gap-1 mt-2">
									{club.tags.map((tag) => (
										<Badge key={tag} variant="outline" className="text-xs">
											{tag}
										</Badge>
									))}
								</div>
							)}
						</div>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						{canJoinLeave &&
							(club.userJoined ? (
								<Button
									variant="outline"
									size="sm"
									onClick={handleLeave}
									disabled={leaveClub.isPending}
									className="gap-1.5"
								>
									<SignOutIcon className="size-4" />
									{leaveClub.isPending ? "Leaving..." : "Leave"}
								</Button>
							) : (
								<Button
									size="sm"
									onClick={handleJoin}
									disabled={joinClub.isPending}
									className="gap-1.5"
								>
									<SignInIcon className="size-4" />
									{joinClub.isPending ? "Joining..." : "Join"}
								</Button>
							))}
						{canManage && (
							<>
								<Button
									variant="outline"
									size="icon"
									onClick={() => (onEdit ? onEdit() : setIsEditing(true))}
									aria-label="Edit club"
								>
									<PencilIcon className="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:text-destructive"
									onClick={() => setDeleteDialogOpen(true)}
									aria-label="Delete club"
								>
									<TrashIcon className="size-4" weight="regular" />
								</Button>
							</>
						)}
					</div>
				</div>

				{club.description && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base">About</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground whitespace-pre-wrap">
								{club.description}
							</p>
						</CardContent>
					</Card>
				)}

				<ClubMembers
					clubId={clubId}
					canManage={canManage}
					canTransferLeadership={clubUserRole === "LEADER"}
				/>
			</div>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete club</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this club? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={deleteClub.isPending}
						>
							{deleteClub.isPending ? "Deleting..." : "Delete"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
