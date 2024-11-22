import { ScrollArea } from "./ui/scroll-area";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed left-0 top-0 z-40 h-full">
        <Sidebar />
      </div>
      <div className="pl-16 sm:pl-64">
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