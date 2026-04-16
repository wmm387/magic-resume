import { useEffect } from 'react'
import { DEFAULT_TEMPLATES } from '@/config'

const TEMPLATE_SNAPSHOT_MANIFEST = {
  classic: '/template-snapshots/zh/classic.png',
  modern: '/template-snapshots/zh/modern.png',
  'left-right': '/template-snapshots/zh/left-right.png',
  timeline: '/template-snapshots/zh/timeline.png',
  minimalist: '/template-snapshots/zh/minimalist.png',
  elegant: '/template-snapshots/zh/elegant.png',
  creative: '/template-snapshots/zh/creative.png',
  editorial: '/template-snapshots/zh/editorial.png',
} as Record<string, string>

export const useTemplateSnapshots = () => {
  const templateMap = DEFAULT_TEMPLATES.map((template) => [template.id, TEMPLATE_SNAPSHOT_MANIFEST[template.id]])
  const snapshotMap = Object.fromEntries(templateMap) as Record<string, string | null>

  useEffect(() => {
    const preloaders = Object.values(snapshotMap)
      .filter((src): src is string => Boolean(src))
      .map((src) => {
        const image = new window.Image()
        image.decoding = 'async'
        image.src = src
        return image
      })

    return () => {
      preloaders.forEach((image) => {
        image.src = ''
      })
    }
  }, [snapshotMap])

  return {
    snapshotMap,
  }
}
