import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import ResumePage from '@/pages/resumes/$id'
import { useResumeStore } from '@/store/useResumeStore'

export const Route = createFileRoute('/resume/$id')({
  component: ResumeRoutePage,
})

function ResumeRoutePage() {
  const { id } = Route.useParams()
  const setActiveResume = useResumeStore((state) => state.setActiveResume)

  useEffect(() => {
    setActiveResume(id)
  }, [id, setActiveResume])

  return <ResumePage />
}
