
import React, { useEffect, useState } from 'react'
import { MobileEditor } from './components/MobileEditor'
import { EditorHeader } from '@/components/editor/EditorHeader'
import { SidePanel } from '@/components/editor/SidePanel'
import { EditPanel } from '@/components/editor/EditPanel'
import PreviewPanel from '@/components/preview'
import PreviewDock from '@/components/preview/PreviewDock'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { cn } from '@/lib/utils'

const LAYOUT_CONFIG = {
  DEFAULT: [20, 32, 48],
  SIDE_COLLAPSED: [50, 50],
  EDIT_FOCUSED: [20, 80],
  PREVIEW_FOCUSED: [20, 80],
}

const DragHandle = ({ show = true }) => {
  if (!show) return null

  return (
    <ResizableHandle className="relative w-1.5 group">
      <div
        className={cn(
          'absolute inset-y-0 left-1/2 w-1 -translate-x-1/2',
          'group-hover:bg-primary/20 group-data-[dragging=true]:bg-primary',
          'bg-border'
        )}
      />
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-4 h-8 rounded-full opacity-0 group-hover:opacity-100',
          'flex items-center justify-center',
          'bg-background border border-border'
        )}
      >
        <div className="w-0.5 h-4 bg-muted-foreground/50 rounded-full" />
      </div>
    </ResizableHandle>
  )
}


export default function ResumePage() {
  const [sidePanelCollapsed, setSidePanelCollapsed] = useState(false)
  const [editPanelCollapsed, setEditPanelCollapsed] = useState(false)
  const [previewPanelCollapsed, setPreviewPanelCollapsed] = useState(false)
  const [panelSizes, setPanelSizes] = useState<number[]>(LAYOUT_CONFIG.DEFAULT)

  // Create a ref for the resume content that PreviewDock can access
  // Currently we can't get the inner ref easily across component boundaries
  // But we need to pass a mock or implement forwardRef in PreviewPanel later
  // For now we pass null to satisfy the prop requirement
  const resumeContentRef = React.useRef<HTMLDivElement>(null)

  const toggleSidePanel = () => {
    setSidePanelCollapsed(!sidePanelCollapsed)
  }

  const toggleEditPanel = () => {
    setEditPanelCollapsed(!editPanelCollapsed)
  }

  const togglePreviewPanel = () => {
    setPreviewPanelCollapsed(!previewPanelCollapsed)
  }

  const updateLayout = (sizes: number[]) => {
    setPanelSizes(sizes)
  }

  useEffect(() => {
    // 如果预览面板已经收起，则不需要自动收起侧边栏，因为空间足够
    if (previewPanelCollapsed) return

    // 初始化检查屏幕宽度
    if (window.innerWidth < 1440) {
      setSidePanelCollapsed(true)
    }

    // 监听 resize
    const handleResize = () => {
      // 屏幕改变时，如果此时预览面板收起，也可以让侧边栏展开
      if (previewPanelCollapsed) return

      if (window.innerWidth < 1440) {
        setSidePanelCollapsed(true)
      } else {
        setSidePanelCollapsed(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [previewPanelCollapsed])

  useEffect(() => {
    document.body?.classList.add('workbench-body-lock')
    return () => {
      document.body?.classList.remove('workbench-body-lock')
    }
  }, [])

  useEffect(() => {
    const newSizes = []

    // 侧边栏尺寸
    newSizes.push(sidePanelCollapsed ? 0 : 20)

    // 编辑区尺寸
    if (editPanelCollapsed) {
      newSizes.push(0)
    } else {
      if (sidePanelCollapsed) {
        newSizes.push(36)
      } else {
        if (previewPanelCollapsed) {
          newSizes.push(80)
        } else {
          newSizes.push(32)
        }
      }
    }

    // 预览区尺寸
    if (previewPanelCollapsed) {
      newSizes.push(0)
    } else {
      if (editPanelCollapsed && sidePanelCollapsed) {
        newSizes.push(100)
      } else {
        if (editPanelCollapsed) {
          newSizes.push(80)
        } else {
          // 如果侧边栏收起且编辑区展开，预览区占64，编辑区占36
          if (sidePanelCollapsed) {
            newSizes.push(64)
          } else {
            newSizes.push(48)
          }
        }
      }
    }

    // 确保总和为 100
    const total = newSizes.reduce((a, b) => a + b, 0)
    if (total !== 100) {
      // 重新计算尺寸，确保总和为 100%
      const nonZeroSizes = newSizes.filter(size => size > 0)
      if (nonZeroSizes.length > 0) {
        const ratio = 100 / total
        const adjustedSizes = newSizes.map(size => size > 0 ? Math.round(size * ratio) : 0)

        // 再次确保总和为 100
        const adjustedTotal = adjustedSizes.reduce((a, b) => a + b, 0)
        if (adjustedTotal !== 100) {
          const lastNonZeroIndex = adjustedSizes
            .map((size, index) => ({ size, index }))
            .filter(({ size }) => size > 0)
            .pop()?.index

          if (lastNonZeroIndex !== undefined) {
            adjustedSizes[lastNonZeroIndex] += 100 - adjustedTotal
          }
        }
        updateLayout([...adjustedSizes])
      } else {
        updateLayout([...newSizes])
      }
    } else {
      updateLayout([...newSizes])
    }
  }, [sidePanelCollapsed, editPanelCollapsed, previewPanelCollapsed])

  return (
    <main
      className={cn(
        'w-full min-h-screen  overflow-hidden',
        'w-full min-h-screen overflow-hidden',
        'bg-background text-foreground'
      )}
    >
      <EditorHeader />
      {/* 移动端布局 */}
      <div className="md:hidden h-[calc(100vh-64px)]">
        <MobileEditor />
      </div>

      {/* 桌面端布局 */}
      <div className="hidden md:block h-[calc(100vh-64px)] relative flex w-full">
        <div className={cn(
          'h-full transition-all duration-300',
          previewPanelCollapsed ? 'w-[calc(100%-4rem)]' : 'w-full'
        )}>
          <ResizablePanelGroup
            key={panelSizes?.join('-')}
            direction="horizontal"
            className={cn(
              'h-full',
              'h-full',
              'border border-border bg-background'
            )}
          >
            {/* 侧边栏面板 */}
            {!sidePanelCollapsed && (
              <>
                <ResizablePanel
                  id="side-panel"
                  order={1}
                  defaultSize={panelSizes?.[0]}
                  className={cn(
                    'bg-background border-r border-border'
                  )}
                >
                  <div className="h-full overflow-y-auto">
                    <SidePanel />
                  </div>
                </ResizablePanel>
                <DragHandle />
              </>
            )}

            {/* 编辑面板 */}
            {!editPanelCollapsed && (
              <>
                <ResizablePanel
                  id="edit-panel"
                  order={2}
                  defaultSize={panelSizes?.[1]}
                  className={cn(
                    'bg-background border-r border-border'
                  )}
                >
                  <div className="h-full">
                    <EditPanel />
                  </div>
                </ResizablePanel>
                <DragHandle />
              </>
            )}
            {/* 预览面板 - 使用 CSS 隐藏而非条件渲染，确保导出时 #resume-preview 始终在 DOM 中 */}
            <ResizablePanel
              id="preview-panel"
              order={3}
              collapsible={false}
              defaultSize={panelSizes?.[2]}
              className={cn('bg-gray-100', previewPanelCollapsed && 'hidden')}
            >
              <div
                className="h-full overflow-y-auto"
                data-preview-scroll-container="true"
              >
                <PreviewPanel />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <PreviewDock
          sidePanelCollapsed={sidePanelCollapsed}
          editPanelCollapsed={editPanelCollapsed}
          previewPanelCollapsed={previewPanelCollapsed}
          toggleSidePanel={toggleSidePanel}
          toggleEditPanel={toggleEditPanel}
          togglePreviewPanel={togglePreviewPanel}
          resumeContentRef={resumeContentRef}
        />
      </div>
    </main>
  )
}
