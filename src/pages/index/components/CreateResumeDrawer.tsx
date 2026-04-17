import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, FilePlus, Sparkles, X } from 'lucide-react'
import { VisuallyHidden } from '@heroui/react'
import TemplateCardThumbnail from './TemplateCardThumbnail'
import type { BlankTemplate, NormalTemplate, TemplateOption } from '@/types/template'
import { useLocale, useTranslations } from '@/i18n/compat/client'
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DEFAULT_TEMPLATES } from '@/config'
import { useTemplateSnapshots } from '@/hooks/useTemplateSnapshots'

interface CreateResumeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (templateId: string | null) => void;
}

const toTemplateNameKey = (templateId: string) => templateId === 'left-right' ? 'leftRight' : templateId

const BLANK_TEMPLATE: BlankTemplate = { id: null, isBlank: true, nameKey: 'blankTitle' }
const NORMAL_TEMPLATES: NormalTemplate[] = DEFAULT_TEMPLATES.map(template => ({
  ...template,
  isBlank: false,
  nameKey: toTemplateNameKey(template.id),
}))

export const CreateResumeDrawer = ({ open, onOpenChange, onCreate }: CreateResumeDrawerProps) => {
  const t = useTranslations()
  const locale = useLocale()
  const { snapshotMap } = useTemplateSnapshots()
  const [previewTarget, setPreviewTarget] = useState<TemplateOption | null>(null)

  const handleCreate = (template: TemplateOption) => {
    onCreate(template.id)
    setPreviewTarget(null)
  }

  // Close preview when drawer closes
  useEffect(() => {
    if (!open) {
      const timeoutId = window.setTimeout(() => setPreviewTarget(null), 300)
      return () => window.clearTimeout(timeoutId)
    }
  }, [open])

  const previewRef = useRef<HTMLDivElement>(null)
  const [previewHeight, setPreviewHeight] = useState('100%')
  useEffect(() => {
    setTimeout(() => {
      if (!previewRef.current) {
        return '100%'
      }
      const { height } = previewRef.current.getBoundingClientRect()
      setPreviewHeight(`${height - 32}px`)
    }, 200)
  }, [previewTarget])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        aria-describedby={undefined}
        className="max-h-[90vh] h-[90vh] p-0 overflow-hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl shadow-2xl rounded-t-[2rem] flex flex-col"
      >
        <VisuallyHidden><DrawerTitle /></VisuallyHidden>
        <div className="relative w-full h-full min-h-0 flex flex-col">
          {/* HEADER BAR */}
          <div className="flex-none px-6 py-4 flex items-center justify-between z-10">
            <div className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 flex items-center">
              {t('dashboard.resumes.createDialog.title')}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label={t('common.cancel')}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 min-h-0 relative w-full">
            <ScrollArea className="h-full w-full">
              <div className="px-6 pb-8 max-w-7xl mx-auto space-y-8">
                {/* SECTION 1: BLANK TEMPLATE */}
                <section>
                  <div className="flex items-center mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t('dashboard.resumes.createDialog.startFromBlank')}
                    </h4>
                    <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 ml-4" />
                  </div>
                  <motion.div
                    layoutId={'card-container-blank'}
                    whileHover={{ y: -2, scale: 1.005 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleCreate(BLANK_TEMPLATE)}
                    className="group cursor-pointer rounded-xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 p-4 flex flex-col items-center gap-4"
                  >
                    {/* Small visual icon area */}
                    <motion.div
                      layoutId={'card-image-blank'}
                      className="h-20 w-20 flex-shrink-0 rounded-xl bg-white dark:bg-gray-800 shadow-inner flex items-center justify-center border border-gray-100 dark:border-gray-700"
                    >
                      <FilePlus className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                    </motion.div>

                    <div className="flex-1 text-center">
                      <motion.div layoutId={'card-title-blank'} className="inline-block">
                        <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                          {t('dashboard.resumes.createDialog.blankTitle')}
                        </h5>
                      </motion.div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm leading-relaxed">
                        {t('dashboard.resumes.createDialog.blankCardDescription')}
                      </p>
                    </div>

                    <div className="flex text-primary font-medium items-center text-sm group-hover:translate-x-0 duration-300">
                      {t('dashboard.resumes.createDialog.createNow')} <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
                    </div>
                  </motion.div>
                </section>

                {/* SECTION 2: NORMAL TEMPLATES */}
                <section>
                  <div className="flex items-center mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t('dashboard.resumes.createDialog.startFromTemplate')}
                    </h4>
                    <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 ml-4" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 hover:!shadow-none">
                    {NORMAL_TEMPLATES.map((template) => {
                      const templateName = t(`dashboard.templates.${template.nameKey}.name`)

                      return (
                        <motion.div
                          key={template.id}
                          layoutId={`card-container-${template.id}`}
                          whileHover={{ y: 0, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPreviewTarget(template)}
                          className="group cursor-pointer flex flex-col"
                        >
                          {/* The Thumbnail Card */}
                          <motion.div
                            layoutId={`card-image-${template.id}`}
                            className="aspect-[210/297] rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-800/60 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/50 dark:group-hover:border-primary/50 bg-white dark:bg-gray-900 relative"
                          >
                            <TemplateCardThumbnail
                              template={template}
                              t={t}
                              snapshotSrc={snapshotMap[template.id]}
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-xl pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </motion.div>

                          {/* Minimalist Title below */}
                          <motion.div
                            layoutId={`card-title-${template.id}`}
                            className="mt-3 flex items-center justify-center"
                          >
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                              {templateName}
                            </span>
                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </div>
                </section>
              </div>
            </ScrollArea>
          </div>

          {/* OVERLAY LARGE PREVIEW (Shared Layout Animation) */}
          <AnimatePresence>
            {previewTarget && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col overflow-hidden rounded-t-[2rem]"
              >
                {/* Top: Header with Back Button */}
                <div className="flex-none px-6 py-4 flex items-center justify-between bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setPreviewTarget(null)}
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label={t('dashboard.resumes.createDialog.backToGrid')}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-500 hover:text-primary dark:text-gray-400" />
                  </button>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {previewTarget.isBlank
                      ? t('dashboard.resumes.createDialog.blankTitle')
                      : t(`dashboard.templates.${previewTarget.nameKey}.name`)}
                  </span>
                  <div className="w-10" />
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Preview Area */}
                  <div ref={previewRef} className="flex-1 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                    <motion.div
                      layoutId={`card-container-${previewTarget.id || 'blank'}`}
                      className="w-full max-w-lg flex items-center justify-center"
                      style={{ height: previewHeight }}
                    >
                      <motion.div
                        layoutId={`card-image-${previewTarget.id || 'blank'}`}
                        className="aspect-[210/297] rounded-xl overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-black/5 bg-white"
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                        }}
                      >
                        <TemplateCardThumbnail
                          template={previewTarget}
                          t={t}
                          snapshotSrc={snapshotMap[previewTarget.id || 'blank']}
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Info and Action Area */}
                  <div className="bg-white border-t border-gray-100 p-6">
                    <motion.div
                      layoutId={`card-title-${previewTarget.id || 'blank'}`}
                      className="inline-block w-full"
                    >
                      <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
                        {previewTarget.isBlank
                          ? t('dashboard.resumes.createDialog.blankTitle')
                          : t(`dashboard.templates.${previewTarget.nameKey}.name`)}
                      </h3>
                    </motion.div>

                    <div className="w-10 h-1.5 bg-primary rounded-full mb-4" />

                    <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6 font-medium">
                      {previewTarget.isBlank
                        ? t('dashboard.resumes.createDialog.blankPreviewDescription')
                        : t(`dashboard.templates.${previewTarget.nameKey}.description`)}
                    </p>

                    <div className="space-y-3">
                      <Button
                        size="lg"
                        className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => handleCreate(previewTarget)}
                      >
                        {t('dashboard.resumes.createDialog.useThisTemplate')}
                        <Sparkles className="w-5 h-5 ml-2 opacity-70" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
