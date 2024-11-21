import { ScrollArea } from "./ui/scroll-area";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-screen">
          <div className="p-4 lg:p-8">
            <main className="animate-fade-in max-w-[1400px] mx-auto">
              {children}
            </main>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;