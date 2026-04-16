import { SidePanel } from '@/components/editor/SidePanel'
import BaseDrawer from '@/components/Base/BaseDrawer'
import { ScrollArea } from '@/components/ui/scroll-area'

interface StyleDrawerProps {
  open: boolean;
  onOpenChange: (newOpen: boolean) => void;
}

export function StyleDrawer({ open, onOpenChange }: StyleDrawerProps) {
  if (!open) return null

  return (
    <BaseDrawer title="样式设置" open={open} onOpenChange={onOpenChange}>
      <ScrollArea className="flex-1 h-full">
        <SidePanel />
      </ScrollArea>
    </BaseDrawer>
  )
}
