
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Palette } from 'lucide-react'
import { ContentDrawer } from './ContentDrawer'
import { StyleDrawer } from './StyleDrawer'
import { cn } from '@/lib/utils'
import PreviewPanel from '@/components/preview'

export function MobileEditor() {
  const [contentOpen, setContentOpen] = useState(false)
  const [styleOpen, setStyleOpen] = useState(false)

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      {/* 主要内容区域 - 始终显示预览 */}
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          key="preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="h-full bg-gray-100 overflow-y-auto"
          data-preview-scroll-container="true"
          style={{ scrollbarWidth: 'none', }}
        >
          <PreviewPanel onSectionClick={() => setContentOpen(true)} />
        </motion.div>
      </div>
      {/* 底部导航栏 */}
      <div className="h-14 border-t bg-background flex items-center justify-around relative shadow-[0_-1px_3px_rgba(0,0,0,0.05)] z-50">
        <button
          onClick={() => setContentOpen(true)}
          className={cn('flex flex-col items-center justify-center py-2 px-4 flex-1 text-muted-foreground')}
        >
          <div className="mb-1">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">内容</span>
        </button>
        <button
          onClick={() => setStyleOpen(true)}
          className={cn('flex flex-col items-center justify-center py-2 px-4 flex-1 text-muted-foreground')}
        >
          <div className="mb-1">
            <Palette className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">样式</span>
        </button>
      </div>
      <ContentDrawer open={contentOpen} onOpenChange={setContentOpen} />
      <StyleDrawer open={styleOpen} onOpenChange={setStyleOpen} />
    </div>
  )
}
