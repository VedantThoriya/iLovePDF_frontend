import { type ReactNode, useEffect, useState } from "react";
import { useJobStore } from "@/store/useJobStore";
import { Settings, Plus } from "lucide-react";
import { FileUploader } from "./FileUploader";
import { FilePreviewGrid } from "./FilePreviewGrid";
import { Sidebar } from "./Sidebar";

interface WorkspaceLayoutProps {
  title: string;
  description?: string;
  sidebarContent: ReactNode;
  actionButton: ReactNode;
  mainContent?: ReactNode;
  showAddMore?: boolean;
}

export const WorkspaceLayout = ({
  title,
  description,
  sidebarContent,
  actionButton,
  mainContent,
  showAddMore = true,
}: WorkspaceLayoutProps) => {
  const { files, reset, addFiles } = useJobStore();
  const hasFiles = files.length > 0;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Clear files/state when entering the workspace
  useEffect(() => {
    reset();
  }, [reset]);

  if (!hasFiles) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center px-4">
        {/* Header Section */}
        <div className="mb-8 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
          {description && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <FileUploader />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Main Content / Workspace Area (Scrolls) */}
      <div className="flex-1 overflow-y-auto relative h-full bg-[#f3f3f5] custom-scrollbar pb-[100px] lg:pb-0">
        {/* Centered Canvas Container */}
        <div className="min-h-full flex flex-col items-center justify-start py-4 lg:py-12 px-4 md:px-8">
          <div className="w-full max-w-[1000px] flex-1 flex flex-col">
            {mainContent || (
              <FilePreviewGrid
                enableDnD={
                  title.toLowerCase().includes("merge") || files.length > 1
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <div className="hidden lg:block h-full z-30 relative">
        {/* Desktop Add Button (Floating left of sidebar) */}
        {showAddMore && (
          <div className="absolute -left-16 top-6 z-50">
            <label className="flex items-center justify-center w-[48px] h-[48px] bg-[#2C7A7B] hover:bg-[#236363] text-white rounded-full shadow-lg cursor-pointer transition-transform hover:scale-105 relative">
              <input
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0)
                    addFiles(Array.from(e.target.files));
                  e.target.value = "";
                }}
              />
              <Plus size={28} />
              {files.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#f3f3f5]">
                  {files.length}
                </div>
              )}
            </label>
          </div>
        )}

        <Sidebar title={title}>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {sidebarContent}
            </div>
            <div className="mt-auto px-0 pt-6 pb-2 border-t border-gray-100 bg-white sticky bottom-0 z-20">
              {actionButton}
            </div>
          </div>
        </Sidebar>
      </div>

      {/* Mobile Action Button (Fixed Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-40 pointer-events-none">
        <div className="pointer-events-auto">{actionButton}</div>
      </div>

      {/* Mobile FABs (Settings & Add) */}
      <div
        className={`lg:hidden fixed top-20 z-50 flex flex-col gap-3 transition-all duration-500 ease-in-out ${
          isSettingsOpen ? "right-[80%] sm:right-[20rem]" : "right-4"
        }`}
      >
        {/* Settings FAB */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center active:scale-95 transition-transform ${
            isSettingsOpen ? "text-[#2C7A7B]" : "text-gray-700"
          }`}
        >
          <Settings size={24} />
        </button>

        {/* Add File FAB */}
        {showAddMore && (
          <label className="w-12 h-12 bg-[#2C7A7B] rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform relative">
            <input
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0)
                  addFiles(Array.from(e.target.files));
                e.target.value = "";
              }}
            />
            <Plus size={28} />
            {files.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-6 h-6   flex items-center justify-center rounded-full border-2 border-[#f3f3f5]">
                {files.length}
              </div>
            )}
          </label>
        )}
      </div>

      {/* Mobile Settings Drawer */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/20 z-20 backdrop-blur-sm transition-opacity duration-500 ${
          isSettingsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSettingsOpen(false)}
      />
      {/* Drawer */}
      <div
        className={`lg:hidden fixed top-[60px] right-0 bottom-0 w-[76%] max-w-sm bg-white shadow-2xl z-30 flex flex-col transition-transform duration-500 ease-in-out border-l border-gray-100 ${
          isSettingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-black">{title}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {/* Render sidebar content here for mobile */}
          {sidebarContent}
        </div>
      </div>
    </div>
  );
};
