import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { RiMarkdownLine } from '@remixicon/react'
import { useTranslations } from '@/i18n/compat/client'
import { useResumeStore } from '@/store/useResumeStore'
import { Button } from '@/components/ui/button'
import { exportResumeAsMarkdown, exportToPdf } from '@/utils/export'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const PdfExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingJson, setIsExportingJson] = useState(false)
  const [isExportingMarkdown, setIsExportingMarkdown] = useState(false)
  const { activeResume } = useResumeStore()
  const { globalSettings = {}, title } = activeResume || {}
  const t = useTranslations('pdfExport')
  const tBasicField = useTranslations('workbench.basicPanel.basicFields')

  const handleExport = async () => {
    await exportToPdf({
      elementId: 'resume-preview',
      title: title || 'resume',
      pagePadding: globalSettings?.pagePadding || 0,
      fontFamily: globalSettings?.fontFamily,
      onStart: () => setIsExporting(true),
      onEnd: () => setIsExporting(false),
      successMessage: t('toast.success'),
      errorMessage: t('toast.error'),
    })
  }

  const handleMarkdownExport = () => {
    exportResumeAsMarkdown({
      resume: activeResume,
      title,
      onStart: () => setIsExportingMarkdown(true),
      onEnd: () => setIsExportingMarkdown(false),
      successMessage: t('toast.markdownSuccess'),
      errorMessage: t('toast.markdownError'),
      markdownOptions: {
        basicFieldLabels: {
          name: tBasicField('name'),
          title: tBasicField('title'),
          employementStatus: tBasicField('employementStatus'),
          birthDate: tBasicField('birthDate'),
          email: tBasicField('email'),
          phone: tBasicField('phone'),
          location: tBasicField('location')
        }
      }
    })
  }

  const isLoading = isExporting || isExportingJson || isExportingMarkdown
  const loadingText = isExporting
    ? t('button.exporting')
    : isExportingJson
      ? t('button.exportingJson')
      : isExportingMarkdown
        ? t('button.exportingMarkdown')
        : ''

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{loadingText}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('button.export')}</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExport} disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            {t('button.exportPdf')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMarkdownExport} disabled={isLoading}>
            <RiMarkdownLine className="w-4 h-4 mr-2" />
            {t('button.exportMarkdown')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default PdfExport
