
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from '@/i18n/compat/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ThemedAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const ThemeModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: ThemedAlertDialogProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const t = useTranslations('themeModal.delete')

  const modalContent = {
    delete: {
      title: t('title'),
      description: (
        <span>
          <span>您确定要删除</span>
          <span className="px-2 font-semibold text-primary">{title}</span>
          <span>吗？</span>
        </span>
      ),
      confirmText: t('confirmText')
    },
  }

  const content = modalContent['delete']

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        onClick={(e) => e.stopPropagation()}
        className="max-w-md rounded-[32px] border-none dark:bg-neutral-900 bg-white p-0 shadow-xl"
      >
        <div className="relative overflow-hidden p-6">
          <div className="relative flex flex-col items-center">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-xl font-bold text-gray-900 dark:text-neutral-200">
                {content.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-gray-500 dark:text-neutral-400">
                {content.description}
                {/* 渲染成组件 */}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-8 flex w-full gap-4 sm:flex-row">
              <AlertDialogCancel className="flex-1 rounded-full dark:bg-gray-800 dark:text-neutral-200  text-base font-semibold text-gray-800 ">
                {t('cancelText')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onConfirm}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative flex-1 overflow-hidden rounded-full bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary"
              >
                <span className="relative z-10">{content.confirmText}</span>
                <motion.div
                  className="absolute inset-0 bg-red-600"
                  initial={false}
                  animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                />
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ThemeModal
