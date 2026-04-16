import { Reorder } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import ExperienceItem from './ExperienceItem'
import type { Experience } from '@/types/resume'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/compat/client'
import { useResumeStore } from '@/store/useResumeStore'
import { generateUUID } from '@/utils/uuid'

const ExperiencePanel = () => {
  const t = useTranslations('workbench.experiencePanel')
  const { activeResume, updateExperience, updateExperienceBatch } = useResumeStore()
  const { experience = [] } = activeResume || {}
  const handleCreateProject = () => {
    const newProject: Experience = {
      id: generateUUID(),
      company: t('defaultProject.company'),
      position: t('defaultProject.position'),
      date: t('defaultProject.date'),
      details: t('defaultProject.details'),
      visible: true,
    }
    updateExperience(newProject)
  }

  return (
    <Reorder.Group
      values={experience}
      onReorder={newOrder => updateExperienceBatch(newOrder)}
      className="space-y-3 px-2 pb-2"
    >
      {experience.map((item) => (
        <ExperienceItem key={item.id} experience={item} />
      ))}
      <Button onClick={handleCreateProject} className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        {t('addButton')}
      </Button>
    </Reorder.Group>
  )
}

export default ExperiencePanel
