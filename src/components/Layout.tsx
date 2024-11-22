import { ScrollArea } from "./ui/scroll-area";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div 
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64",
          "sm:block"
        )}
      >
        <ScrollArea className="h-screen w-full">
          <div className="p-2 sm:p-4 lg:p-8">
            <main className="animate-fade-in max-w-[2000px] mx-auto">
              {children}
            </main>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;