import { X } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'

interface BaseDrawerProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function BaseDrawer({ title, open, onOpenChange, children }: BaseDrawerProps) {

  if (!open) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        aria-describedby={undefined}
        className="h-[85vh] p-0 overflow-hidden backdrop-blur-2xl shadow-2xl rounded-t-[2rem] flex flex-col"
      >
        <DrawerHeader className="bg-background/95">
          <div className="flex items-center justify-between">
            <DrawerTitle>{title}</DrawerTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-2 -mr-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </DrawerHeader>

        {/* Drawer 内容区域 */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default BaseDrawer
