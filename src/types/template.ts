import type { CSSProperties } from 'react'

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  thumbnail: string
  layout: string
  colorScheme: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  spacing: {
    sectionGap: number
    itemGap: number
    contentPadding: number
  }
  basic: {
    layout?: 'left' | 'center' | 'right'
  }
  availableSections?: string[]
}

export type BlankTemplate = {
  id: null
  isBlank: true
  nameKey: 'blankTitle'
}

export type NormalTemplate = ResumeTemplate & { isBlank: false; nameKey: string }
export type TemplateOption = NormalTemplate | BlankTemplate

export interface TemplateConfig {
  sectionTitle: {
    className?: string
    styles: CSSProperties
  }
}
