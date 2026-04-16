import { useEffect, useRef } from 'react'
import type { MenuSection } from '@/types/resume'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/useResumeStore'
import { EditPanel } from '@/components/editor/EditPanel'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import BaseDrawer from '@/components/Base/BaseDrawer'

interface ContentDrawerProps {
  open: boolean;
  onOpenChange: (newOpen: boolean) => void;
}




export function ContentDrawer({ open, onOpenChange }: ContentDrawerProps) {
  const { activeResume, setActiveSection } = useResumeStore()
  const { activeSection, menuSections } = activeResume || {}
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    setTimeout(() => {
      if (open && activeSection) {
        sectionRefs.current[activeSection]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }
    }, 200)
  }, [activeSection, open])

  if (!open) return null

  return (
    <BaseDrawer title="内容编辑" open={open} onOpenChange={onOpenChange}>
      <div className="h-full flex flex-col">
        {/* 顶部模块选择器 */}
        <div className="border-b bg-background/95 backdrop-blur">
          <ScrollArea className="w-full whitespace-nowrap" ref={scrollAreaRef}>
            <div className="flex pb-2 px-2 space-x-2">
              {menuSections?.filter((s) => s.enabled).map(section => (
                <button
                  ref={el => sectionRefs.current[section.id] = el}
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:bg-muted'
                  )}
                >
                  <span className="mr-1.5">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
        {/* 编辑区域 */}
        <ScrollArea className="flex-1 h-full">
          <EditPanel />
        </ScrollArea>
      </div>
    </BaseDrawer>
  )
}
