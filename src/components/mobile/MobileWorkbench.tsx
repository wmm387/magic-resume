
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Palette, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import PreviewPanel from "@/components/preview";
import { ContentDrawer } from "./ContentDrawer";
import { StyleDrawer } from "./StyleDrawer";

type TabType = "content" | "style" | "preview";

export function MobileWorkbench() {
  const [activeTab, setActiveTab] = useState<TabType>("preview");

  const closeDrawer = () => {
    setActiveTab("preview");
  };

  // 渲染底部导航项
  const renderNavItem = (tab: TabType, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        "flex flex-col items-center justify-center py-2 px-4 flex-1 transition-colors",
        activeTab === tab
          ? "text-primary"
          : "text-muted-foreground hover:text-primary/80"
      )}
    >
      <div className={cn("mb-1", activeTab === tab && "scale-110 duration-200")}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
      {activeTab === tab && (
        <motion.div
          layoutId="mobile-nav-indicator"
          className="absolute bottom-0 w-12 h-1 bg-primary rounded-t-full"
        />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      {/* 主要内容区域 - 始终显示预览 */}
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          key="preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="h-full overflow-y-auto bg-gray-100"
          data-preview-scroll-container="true"
        >
          <PreviewPanel
            sidePanelCollapsed={true}
            editPanelCollapsed={true}
            previewPanelCollapsed={false}
            toggleSidePanel={() => { }}
            toggleEditPanel={() => { }}
            togglePreviewPanel={() => { }}
          />
        </motion.div>
      </div>

      {/* 底部导航栏 */}
      <div className="h-16 border-t bg-background flex items-center justify-around relative shadow-[0_-1px_3px_rgba(0,0,0,0.05)] z-50">
        {renderNavItem("content", <FileText className="w-5 h-5" />, "内容")}
        {renderNavItem("style", <Palette className="w-5 h-5" />, "样式")}
        {/* {renderNavItem("preview", <Eye className="w-5 h-5" />, "预览")} */}
      </div>

      {/* Content Drawer */}
      <ContentDrawer
        open={activeTab === "content"}
        onClose={closeDrawer}
      />

      {/* Style Drawer */}
      <StyleDrawer
        isOpen={activeTab === "style"}
        onClose={closeDrawer}
      />
    </div>
  );
}
