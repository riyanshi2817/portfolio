import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { ForumList } from "@/components/forums/ForumList"
import { ForumDetail } from "@/components/forums/ForumDetail"
import { ForumForm } from "@/components/forums/ForumForm"
import { useAuthMe } from "@/hooks/use-auth"
import type { ForumSummary } from "@/hooks/use-forums"

export function CommunityDiscussionPage() {
  const { forumId: paramForumId } = useParams()
  const navigate = useNavigate()
  const { data: authData } = useAuthMe()
  const isAuthenticated = !!authData?.user

  const [selectedForumId, setSelectedForumId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (paramForumId) {
      setSelectedForumId(paramForumId)
      setIsCreating(false)
    } else {
      setSelectedForumId(null)
    }
  }, [paramForumId])

  const handleSelectForum = (forum: ForumSummary) => {
    setSelectedForumId(forum._id)
    setIsCreating(false)
    navigate(`/community/discussion/${forum._id}`, { replace: true })
  }

  const handleCreateNew = () => {
    setSelectedForumId(null)
    setIsCreating(true)
    navigate("/community/discussion", { replace: true })
  }

  const handleCreateSuccess = (forumId: string) => {
    setSelectedForumId(forumId)
    setIsCreating(false)
    navigate(`/community/discussion/${forumId}`, { replace: true })
  }

  const handleDeleteForum = (id: string) => {
    if (selectedForumId === id) {
      setSelectedForumId(null)
      navigate("/community/discussion", { replace: true })
    }
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 -m-4 border overflow-hidden">
      <ForumList
        selectedForumId={selectedForumId}
        onSelectForum={handleSelectForum}
        onCreateNew={handleCreateNew}
        showCreateForum={isAuthenticated}
      />
      <div className="flex min-h-0 flex-1 min-w-0 flex-col overflow-hidden bg-background">
        {selectedForumId ? (
          <ForumDetail forumId={selectedForumId} onDelete={handleDeleteForum} />
        ) : isCreating && isAuthenticated ? (
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4">
            <ForumForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreating(false)} />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center p-4 w-full">
            {isAuthenticated && !isCreating && (
              <ForumForm
                onSuccess={handleCreateSuccess}
                className="max-w-xl w-full min-w-0"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
