import { Reorder } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import EducationItem from './EducationItem'
import type { Education } from '@/types/resume'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/useResumeStore'
import { useTranslations } from '@/i18n/compat/client'
import { Button } from '@/components/ui/button'
import { generateUUID } from '@/utils/uuid'

const EducationPanel = () => {
  const t = useTranslations('workbench.educationPanel')
  const { activeResume, updateEducation, updateEducationBatch } =
    useResumeStore()
  const { education = [] } = activeResume || {}
  const handleCreateProject = () => {
    const newEducation: Education = {
      id: generateUUID(),
      school: t('defaultProject.school'),
      major: t('defaultProject.major'),
      degree: t('defaultProject.degree'),
      startDate: '2015-09-01',
      endDate: '2019-06-30',
      description: '',
      visible: true,
    }
    updateEducation(newEducation)
  }

  return (
    <Reorder.Group
      values={education}
      onReorder={(newOrder) => updateEducationBatch(newOrder)}
      className="space-y-3 px-2 pb-2"
    >
      {education.map((education) => (
        <EducationItem key={education.id} education={education} />
      ))}
      <Button onClick={handleCreateProject} className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        {t('addButton')}
      </Button>
    </Reorder.Group>
  )
}

export default EducationPanel
