import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router"

import { useAuthMe } from "@/hooks/use-auth"
import { Layout } from "@/components/layout"
import { AdminGuard } from "@/components/admin-guard"
import { ForgotPasswordPage } from "@/pages/forgot-password"
import { LoginPage } from "@/pages/login"
import { SignupPage } from "@/pages/signup"
import { DashboardPage } from "@/pages/dashboard"
import { CommunityPage } from "@/pages/community"
import { CommunityGroupPage } from "@/pages/community-group"
import { CommunityDiscussionPage } from "@/pages/community-discussion"
import { CommunityChatsPage } from "@/pages/community-chats"
import { ClubsPage } from "@/pages/clubs"
import { EventsPage } from "@/pages/events"
import { AcademicsPage } from "@/pages/academics"
import { AcademicsSyllabusPage } from "@/pages/academics-syllabus"
import { AcademicsPyqsPage } from "@/pages/academics-pyqs"
import { AcademicsLectureNotesPage } from "@/pages/academics-lecture-notes"
import { AiPage } from "@/pages/ai"
import { AiRoadMapPage } from "@/pages/ai-road-map"
import { AiDoubtsSolverPage } from "@/pages/ai-doubts-solver"
import { AiStudyPlanPage } from "@/pages/ai-study-plan"
import { QuizzesPage } from "@/pages/quizzes"
import { ProfilePage } from "@/pages/profile"
import { AdminPage } from "@/pages/admin"

function AuthRedirect() {
  const { isError, error, refetch } = useAuthMe()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isError || !error || (error as Error & { status?: number }).status !== 401) return

    const path = location.pathname
    if (path.startsWith("/login") || path.startsWith("/signup") || path.startsWith("/forgot-password")) return

    const timeoutId = setTimeout(async () => {
      const result = await refetch()
      if (result.isError && result.error && (result.error as Error & { status?: number }).status === 401) {
        navigate("/login", { replace: true })
      }
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [isError, error, refetch, navigate, location.pathname])

  return null
}

export function App() {
  return (
    <BrowserRouter>
      <AuthRedirect />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="community/group" element={<CommunityGroupPage />} />
          <Route path="community/discussion/:forumId" element={<CommunityDiscussionPage />} />
          <Route path="community/discussion/:forumId" element={<CommunityDiscussionPage />} />
          <Route path="community/discussion" element={<CommunityDiscussionPage />} />
          <Route path="community/chats" element={<CommunityChatsPage />} />
          <Route path="clubs/:clubId" element={<ClubsPage />} />
          <Route path="clubs" element={<ClubsPage />} />
          <Route path="events/:eventId" element={<EventsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="academics" element={<AcademicsPage />} />
          <Route path="academics/syllabus" element={<AcademicsSyllabusPage />} />
          <Route path="academics/pyqs" element={<AcademicsPyqsPage />} />
          <Route path="academics/lecture-notes" element={<AcademicsLectureNotesPage />} />
          <Route path="ai" element={<AiPage />} />
          <Route path="ai/road-map/:roadmapId" element={<AiRoadMapPage />} />
          <Route path="ai/road-map" element={<AiRoadMapPage />} />
          <Route path="ai/study-plan/:planId" element={<AiStudyPlanPage />} />
          <Route path="ai/study-plan" element={<AiStudyPlanPage />} />
          <Route path="ai/doubts-solver" element={<AiDoubtsSolverPage />} />
          <Route path="quizzes/:quizId/results" element={<QuizzesPage />} />
          <Route path="quizzes/:quizId/play" element={<QuizzesPage />} />
          <Route path="quizzes/:quizId" element={<QuizzesPage />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="admin"
            element={
              <AdminGuard>
                <AdminPage />
              </AdminGuard>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
