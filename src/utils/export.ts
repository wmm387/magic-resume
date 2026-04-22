import { toast } from 'sonner'
import type { ResumeData } from '@/types/resume'
import type { ResumeMarkdownOptions } from '@/utils/markdown'
import { PDF_EXPORT_CONFIG } from '@/config'
import { getFontFaceCss, normalizeFontFamily } from '@/utils/fonts'
import { generateResumeMarkdown } from '@/utils/markdown'

const INVALID_FILE_NAME_CHAR_REGEX = /[\\/:*?"<>|]/g

const getSafeFileName = (title?: string) => {
  const normalized = (title || 'resume').trim().replace(INVALID_FILE_NAME_CHAR_REGEX, '_').replace(/\s+/g, ' ')

  return normalized || 'resume'
}

async function downloadViaIOS(content: string, styles: string, pagePadding: number, fileName: string) {
  window.webkit?.messageHandlers?.iOS_Resume_Output?.postMessage({
    content,
    styles,
    pagePadding,
    fileName,
  })
}

// async function downloadViaIOS(blob: Blob, fileName: string) {
//   const reader = new FileReader()
//   const base64 = await new Promise((resolve, reject) => {
//     reader.onloadend = () => {
//       // data:application/pdf;base64,xxxx
//       const result = reader.result || ''
//       const b64 = String(result).split(',')[1]
//       resolve(b64)
//     }
//     reader.onerror = reject
//     reader.readAsDataURL(blob)
//   })
//   window.webkit?.messageHandlers?.iOS_Resume_Output?.postMessage({
//     fileName,
//     mimeType: blob.type || 'application/octet-stream',
//     base64,
//   })
// }

async function downloadMarkdownViaIOS(blob: Blob, fileName: string) {
  const reader = new FileReader()
  const base64 = await new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const result = reader.result || ''
      const b64 = String(result).split(',')[1]
      resolve(b64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
  window.webkit?.messageHandlers?.iOS_Resume_Output?.postMessage({
    fileName,
    mimeType: blob.type || 'application/octet-stream',
    base64,
  })
}

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.URL.revokeObjectURL(url)
}

const downloadTextFile = async (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  // downloadBlob(blob, fileName)
  await downloadMarkdownViaIOS(blob, fileName)
}

export const getOptimizedStyles = () => {
  const styleCache = new Map()
  const startTime = performance.now()

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .filter((rule) => {
            const ruleText = rule.cssText
            const normalizedRuleText = ruleText.toLowerCase()
            if (styleCache.has(ruleText)) return false
            styleCache.set(ruleText, true)

            if (rule instanceof CSSFontFaceRule) return false
            if (rule instanceof CSSImportRule) return false
            if (normalizedRuleText.includes('fonts.googleapis.com')) return false
            if (normalizedRuleText.includes('fonts.gstatic.com')) return false
            if (ruleText.includes('font-family')) return false
            if (ruleText.includes('@keyframes')) return false
            if (ruleText.includes('animation')) return false
            if (ruleText.includes('transition')) return false
            if (ruleText.includes('hover')) return false
            return true
          })
          .map((rule) => rule.cssText)
          .join('\n')
      } catch (e) {
        console.warn('Style processing error:', e)
        return ''
      }
    })
    .join('\n')

  console.log(`Style processing took ${performance.now() - startTime}ms`)
  return styles
}

export const optimizeImages = async (element: HTMLElement) => {
  const startTime = performance.now()
  const images = element.getElementsByTagName('img')

  const imagePromises = Array.from(images)
    .filter((img) => !img.src.startsWith('data:'))
    .map(async (img) => {
      try {
        const response = await fetch(img.src)
        const blob = await response.blob()
        return new Promise<void>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            img.src = reader.result as string
            resolve()
          }
          reader.readAsDataURL(blob)
        })
      } catch (error) {
        console.error('Image conversion error:', error)
        return Promise.resolve()
      }
    })

  await Promise.all(imagePromises)
  console.log(`Image processing took ${performance.now() - startTime}ms`)
}

export type ExportMode = 'local' | 'server'

export interface ExportToPdfOptions {
  elementId: string
  title: string
  pagePadding: number
  fontFamily?: string
  onStart?: () => void
  onEnd?: () => void
  successMessage?: string
  errorMessage?: string
  mode?: ExportMode
}

interface ExportResumeFileOptions {
  resume?: ResumeData | null
  title?: string
  onStart?: () => void
  onEnd?: () => void
  successMessage?: string
  errorMessage?: string
}

interface ExportResumeMarkdownOptions extends ExportResumeFileOptions {
  markdownOptions?: ResumeMarkdownOptions
}

export const exportResumeAsJson = ({ resume, title, onStart, onEnd, successMessage, errorMessage }: ExportResumeFileOptions) => {
  onStart?.()

  try {
    if (!resume) {
      throw new Error('No active resume')
    }

    const json = JSON.stringify(resume, null, 2)
    const fileName = `${getSafeFileName(title || resume.title)}.json`
    downloadTextFile(json, fileName, 'application/json;charset=utf-8')
    if (successMessage) toast.success(successMessage)
  } catch (error) {
    console.error('JSON export error:', error)
    if (errorMessage) toast.error(errorMessage)
  } finally {
    onEnd?.()
  }
}

export const exportResumeAsMarkdown = async ({ resume, title, onStart, onEnd, successMessage, errorMessage, markdownOptions }: ExportResumeMarkdownOptions) => {
  onStart?.()

  try {
    if (!resume) {
      throw new Error('No active resume')
    }

    const markdown = generateResumeMarkdown(resume, markdownOptions)
    const fileName = `${getSafeFileName(title || resume.title)}.md`
    await downloadTextFile(markdown, fileName, 'text/markdown;charset=utf-8')
    if (successMessage) toast.success(successMessage)
  } catch (error) {
    console.error('Markdown export error:', error)
    if (errorMessage) toast.error(errorMessage)
  } finally {
    onEnd?.()
  }
}

const getCloneHtml = async (elementId: string, fontFamily?: string) => {
  const pdfElement = document.querySelector<HTMLElement>(`#${elementId}`)
  if (!pdfElement) {
    throw new Error(`PDF element #${elementId} not found`)
  }

  const clonedElement = pdfElement.cloneNode(true) as HTMLElement
  const selectedFontFamily = normalizeFontFamily(fontFamily)

  // 移除 transform 缩放，确保导出尺寸正确
  clonedElement.style.removeProperty('transform')
  clonedElement.style.removeProperty('transform-origin')
  clonedElement.style.setProperty('width', '100%', 'important')

  // 设置基础样式
  clonedElement.style.setProperty('padding', '0', 'important')
  clonedElement.style.setProperty('box-sizing', 'border-box')
  clonedElement.style.setProperty('font-family', selectedFontFamily, 'important')
  clonedElement.style.setProperty('background', 'white', 'important')
  clonedElement.style.setProperty('background-color', 'white', 'important')

  // 隐藏分页线
  const pageBreakLines = clonedElement.querySelectorAll<HTMLElement>('.page-break-line')
  pageBreakLines.forEach((line) => {
    line.style.display = 'none'
  })

  // 优化图片
  await optimizeImages(clonedElement)

  const [capturedStyles] = await Promise.all([getOptimizedStyles()])

  const styles = `
        ${capturedStyles}
        html, body { background: white !important; background-color: white !important; }
        html, body, #${elementId} {
          background: white !important;
          background-color: white !important;
          font-family: ${selectedFontFamily} !important;
        }
      `

  return { clonedElement, styles }
}

export const exportToPdf = async ({ elementId, title, pagePadding, fontFamily, onStart, onEnd, successMessage, errorMessage, mode = 'server' }: ExportToPdfOptions) => {
  const exportStartTime = performance.now()
  onStart?.()
  try {
    const { clonedElement, styles } = await getCloneHtml(elementId, fontFamily)
    // const response = await fetch(PDF_EXPORT_CONFIG.SERVER_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     content: clonedElement.outerHTML,
    //     styles,
    //     margin: pagePadding,
    //   }),
    //   mode: 'cors',
    //   signal: AbortSignal.timeout(PDF_EXPORT_CONFIG.TIMEOUT),
    // })
    // if (!response.ok) {
    //   throw new Error(`PDF generation failed: ${response.status}`)
    // }
    // const blob = await response.blob()
    const fileName = `${getSafeFileName(title)}.pdf`
    // downloadBlob(blob, fileName)
    await downloadViaIOS(clonedElement.outerHTML, styles, pagePadding, fileName)
    // if (successMessage) toast.success(successMessage)
    console.log(`Total export took ${performance.now() - exportStartTime}ms`)
  } catch (error) {
    console.error('Export error:', error)
    toast.error((error as any).toString() || errorMessage)
  } finally {
    onEnd?.()
  }
}
