import { Reorder } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import ProjectItem from './ProjectItem'
import type { Project } from '@/types/resume'
import { useResumeStore } from '@/store/useResumeStore'
import { useTranslations } from '@/i18n/compat/client'
import { Button } from '@/components/ui/button'
import { generateUUID } from '@/utils/uuid'

const ProjectPanel = () => {
  const t = useTranslations('workbench.projectPanel')
  const { activeResume, updateProjects, updateProjectsBatch } =
    useResumeStore()
  const { projects = [] } = activeResume || {}
  const handleCreateProject = () => {
    const newProject: Project = {
      id: generateUUID(),
      name: t('defaultProject.name'),
      role: t('defaultProject.role'),
      date: t('defaultProject.date'),
      description: t('defaultProject.description'),
      visible: true,
    }
    updateProjects(newProject)
  }

  return (
    <Reorder.Group
      values={projects}
      onReorder={newOrder => updateProjectsBatch(newOrder)}
      className="space-y-3 px-2 pb-2"
    >
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
      <Button onClick={handleCreateProject} className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        {t('addButton')}
      </Button>
    </Reorder.Group>
  )
}

export default ProjectPanel
