import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import { EditPanel } from "@/components/editor/EditPanel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import BaseDrawer from "@/components/Base/BaseDrawer";

interface ContentDrawerProps {
  open: boolean;
  onClose: () => void;
}


export function ContentDrawer({ open, onClose }: ContentDrawerProps) {
  const { activeResume, setActiveSection } = useResumeStore();
  const { activeSection, menuSections } = activeResume || {};

  if (!open) return null;

  const onOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <BaseDrawer title="内容编辑" open={open} onOpenChange={onOpenChange}>
      <div className="h-full flex flex-col">
        {/* 顶部模块选择器 */}
        <div className="border-b bg-background/95 backdrop-blur">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex p-2 space-x-2">
              {/* 基础信息 */}
              <button
                onClick={() => setActiveSection("basic")}
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                  activeSection === "basic"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                )}
              >
                <span className="mr-1.5">👤</span>
                基本信息
              </button>

              {/* 其他模块 */}
              {menuSections
                ?.filter((s) => s.id !== "basic" && s.enabled)
                .map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
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
  );
}
