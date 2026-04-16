import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import html2pdf from 'html2pdf.js'
import type { ResumeData } from '@/types/resume'
import type { ResumeMarkdownOptions } from '@/utils/markdown'
import { PDF_EXPORT_CONFIG } from '@/config'
import { normalizeFontFamily } from '@/utils/fonts'
import { generateResumeMarkdown } from '@/utils/markdown'

const INVALID_FILE_NAME_CHAR_REGEX = /[\\/:*?"<>|]/g

const getSafeFileName = (title?: string) => {
  const normalized = (title || 'resume').trim().replace(INVALID_FILE_NAME_CHAR_REGEX, '_').replace(/\s+/g, ' ')

  return normalized || 'resume'
}

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.URL.revokeObjectURL(url)
}

const downloadTextFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  downloadBlob(blob, fileName)
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

export const exportResumeAsMarkdown = ({ resume, title, onStart, onEnd, successMessage, errorMessage, markdownOptions }: ExportResumeMarkdownOptions) => {
  onStart?.()

  try {
    if (!resume) {
      throw new Error('No active resume')
    }

    const markdown = generateResumeMarkdown(resume, markdownOptions)
    const fileName = `${getSafeFileName(title || resume.title)}.md`
    downloadTextFile(markdown, fileName, 'text/markdown;charset=utf-8')
    if (successMessage) toast.success(successMessage)
  } catch (error) {
    console.error('Markdown export error:', error)
    if (errorMessage) toast.error(errorMessage)
  } finally {
    onEnd?.()
  }
}

export const exportToPdf = async ({ elementId, title, pagePadding, fontFamily, onStart, onEnd, successMessage, errorMessage, mode = 'server' }: ExportToPdfOptions) => {
  const exportStartTime = performance.now()
  onStart?.()

  try {
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

    if (mode === 'server') {
      // 服务端导出
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

      const response = await fetch(PDF_EXPORT_CONFIG.SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: clonedElement.outerHTML,
          styles,
          margin: pagePadding,
        }),
        mode: 'cors',
        signal: AbortSignal.timeout(PDF_EXPORT_CONFIG.TIMEOUT),
      })

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.status}`)
      }

      const blob = await response.blob()
      const fileName = `${getSafeFileName(title)}.pdf`
      downloadBlob(blob, fileName)
    } else {
      // 本地导出 - 移除之前设置的 padding:0，让元素使用自身样式
      clonedElement.style.removeProperty('padding')

      // 获取原始元素的计算样式
      const originalStyle = window.getComputedStyle(pdfElement)

      // 创建临时容器，设置 A4 纸张尺寸和 padding
      const tempContainer = document.createElement('div')
      tempContainer.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        background: white;
        padding: ${pagePadding}px;
        box-sizing: border-box;
        width: 210mm;
        min-height: 297mm;
        font-family: ${selectedFontFamily};
        display: block;
      `
      document.body.appendChild(tempContainer)
      tempContainer.appendChild(clonedElement)

      try {
        // 等待元素渲染和图片加载完成
        await new Promise((resolve) => setTimeout(resolve, 300))

        // 获取容器的实际尺寸
        const containerRect = tempContainer.getBoundingClientRect()
        const scrollHeight = tempContainer.scrollHeight

        console.log(`Export container dimensions: ${containerRect.width}x${containerRect.height}, scrollHeight: ${scrollHeight}`)

        // 使用 html2canvas 捕获完整内容
        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: containerRect.width,
          windowHeight: Math.max(containerRect.height, scrollHeight),
          x: 0,
          y: 0,
          // useOverflowHidden: false,
          removeContainer: false,
        })

        console.log(`Canvas created: ${canvas.width}x${canvas.height}`)

        // 使用 jsPDF 直接创建 PDF（html2pdf 内部使用的库）
        const jsPDF = (window as any).jspdf
        if (jsPDF) {
          const pdf = new jsPDF.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
          })

          const imgWidth = 210 // A4 width in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          // 如果内容高度超过 A4，需要分页
          const pageHeight = 297 // A4 height in mm
          let heightLeft = imgHeight
          let position = 0

          while (heightLeft > 0) {
            pdf.addImage(canvas, 'JPEG', 0, position, imgWidth, Math.min(heightLeft, pageHeight))
            heightLeft -= pageHeight
            position -= pageHeight

            if (heightLeft > 0) {
              pdf.addPage()
            }
          }

          pdf.save(`${getSafeFileName(title)}.pdf`)
        } else {
          // 回退到 html2pdf
          const opt = {
            margin: 0,
            filename: `${getSafeFileName(title)}.pdf`,
            image: { type: 'jpeg', quality: 0.95 },
            jsPDF: {
              unit: 'mm',
              format: 'a4',
              orientation: 'portrait',
            },
          }
          await html2pdf().set(opt).from(canvas).save()
        }
      } finally {
        // 清理临时容器
        document.body.removeChild(tempContainer)
      }
    }

    if (successMessage) toast.success(successMessage)
    console.log(`Total export took ${performance.now() - exportStartTime}ms`)
  } catch (error) {
    console.error('Export error:', error)
    // if (errorMessage) toast.error(errorMessage)
    toast.error((error as any).toString() || errorMessage)
  } finally {
    onEnd?.()
  }
}
