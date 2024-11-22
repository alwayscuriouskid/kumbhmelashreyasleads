import { ScrollArea } from "./ui/scroll-area";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="fixed left-0 top-0 z-40 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-16 sm:ml-64 transition-all duration-300">
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