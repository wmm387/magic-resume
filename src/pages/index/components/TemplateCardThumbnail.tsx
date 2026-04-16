import { FilePlus } from 'lucide-react'
import type { Translator } from '@/i18n/compat/utils'
import type { TemplateOption } from '@/types/template'

interface TemplateCardThumbnailProps {
  template: TemplateOption,
  t: Translator,
  snapshotSrc?: string | null,
}

const BlankTemplateThumbnail = ({ t }: { t: Translator }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50">
    <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-6 text-gray-400 group-hover:text-primary transition-colors">
      <FilePlus className="w-12 h-12" />
    </div>
    <span className="text-2xl font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
      {t('dashboard.resumes.createDialog.blankTitle')}
    </span>
    <p className="text-gray-500 mt-4 text-base px-8 text-center leading-relaxed">
      {t('dashboard.resumes.createDialog.blankThumbnailDescription')}
    </p>
  </div>
)

export default function TemplateCardThumbnail({ template, t, snapshotSrc, }: TemplateCardThumbnailProps) {
  if (template.isBlank) {
    return <BlankTemplateThumbnail t={t} />
  }

  if (snapshotSrc) {
    return (
      <img
        src={snapshotSrc}
        alt={t(`dashboard.templates.${template.nameKey}.name`)}
        className="h-full w-full object-cover object-top"
        loading="eager"
        draggable={false}
      />
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50">
      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        {t(`dashboard.templates.${template.nameKey}.name`)}
      </span>
    </div>
  )
}



