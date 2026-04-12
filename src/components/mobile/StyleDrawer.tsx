import { SidePanel } from "@/components/editor/SidePanel";

interface StyleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StyleDrawer({ isOpen, onClose }: StyleDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Drawer 内容 */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[70vh] bg-background rounded-t-2xl shadow-2xl z-50 flex flex-col"
      >
        {/* Drawer 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-sm font-medium">样式设置</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer 内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <SidePanel />
        </div>
      </div>
    </>
  );
}
