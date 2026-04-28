import { useState, useEffect } from "react"
import { getSocket } from "@/lib/socket"
import { StudentGuard } from "@/components/student-guard"
import { GroupsSidebar } from "@/components/groups/GroupsSidebar"
import { GroupChat } from "@/components/groups/GroupChat"
import { GroupsEmptyState } from "@/components/groups/GroupsEmptyState"
import type { Group } from "@/hooks/use-groups"

export function CommunityGroupPage() {
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

	useEffect(() => {
		getSocket()
	}, [])

	return (
		<StudentGuard>
			<div className="flex h-full min-h-0 min-w-0 -m-4 border">
				<GroupsSidebar
					selectedGroupId={
						selectedGroup?._id ?? selectedGroup?.socketRoom ?? null
					}
					onSelectGroup={setSelectedGroup}
				/>
				<div className="flex min-h-0 flex-1 min-w-0 overflow-hidden bg-background">
					{selectedGroup ? (
						<GroupChat group={selectedGroup} />
					) : (
						<GroupsEmptyState />
					)}
				</div>
			</div>
		</StudentGuard>
	)
}
