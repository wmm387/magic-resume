import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import PdfExport from '../shared/PdfExport'
import { useRouter } from '@/lib/navigation'
import { Input } from '@/components/ui/input'
import { useResumeStore } from '@/store/useResumeStore'

interface EditorHeaderProps {
  isMobile?: boolean;
}

export function EditorHeader({ isMobile }: EditorHeaderProps) {
  const { activeResume, updateResumeTitle } = useResumeStore()
  const router = useRouter()

  return (
    <motion.header
      className={'h-16 border-b sticky top-0 z-10'}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 h-full pr-2">
        <div className="cursor-pointer" onClick={() => router.back()}>
          <ArrowLeft />
        </div>
        <div className="flex items-center space-x-3">
          <Input
            key={activeResume?.id || 'resume-title'}
            defaultValue={activeResume?.title || ''}
            onBlur={(e) => {
              updateResumeTitle(e.target.value || '未命名简历')
            }}
            className="w-[150px] text-sm"
            placeholder="简历名称"
          />
          <div className="md:flex items-center ">
            <PdfExport />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

