export type SidebarSection = {
	id: string
	label: string
	route: string
	subSections?: { id: string; label: string; route: string }[]
	/** If set, section is only visible when user.role is in this array */
	roles?: ("STUDENT" | "FACULTY" | "ADMIN")[]
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
	{ id: "dashboard", label: "Dashboard", route: "/dashboard" },
	{
		id: "community",
		label: "Community",
		route: "/community",
		subSections: [
			{ id: "group", label: "Group", route: "/community/group" },
			{ id: "discussion", label: "Discussion", route: "/community/discussion" },
			{ id: "chats", label: "Chats", route: "/community/chats" },
		],
	},
	{
		id: "academics",
		label: "Academics",
		route: "/academics",
		subSections: [
			{ id: "syllabus", label: "Syllabus", route: "/academics/syllabus" },
			{ id: "pyqs", label: "PYQs", route: "/academics/pyqs" },
			{ id: "lecture-notes", label: "Lecture Notes", route: "/academics/lecture-notes" },
		],
	},
	{ id: "quiz", label: "Quiz", route: "/quizzes" },
	{ id: "clubs", label: "Clubs", route: "/clubs" },
	{ id: "events", label: "Events", route: "/events" },
	{
		id: "ai",
		label: "AI",
		route: "/ai",
		subSections: [
			{ id: "road-map", label: "Road Map", route: "/ai/road-map" },
			{ id: "study-plan", label: "Study Plan", route: "/ai/study-plan" },
			{ id: "Doubts-Solver", label: "Doubts Solver", route: "/ai/doubts-solver" },
		],
	},
	{ id: "profile", label: "Profile", route: "/profile" },
	{ id: "admin", label: "Admin", route: "/admin", roles: ["ADMIN"] },
]
