import { SidePanel } from "@/components/editor/SidePanel";
import BaseDrawer from "@/components/Base/BaseDrawer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StyleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StyleDrawer({ isOpen, onClose }: StyleDrawerProps) {
  if (!isOpen) return null;

  return (
    <BaseDrawer title="样式设置" open={isOpen} onOpenChange={onClose}>
      <ScrollArea className="flex-1 h-full">
        <SidePanel />
      </ScrollArea>
    </BaseDrawer>
  );
}
