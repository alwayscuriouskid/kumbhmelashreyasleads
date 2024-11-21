import { ScrollArea } from "./ui/scroll-area";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <ScrollArea className="h-screen">
          <div className="p-4 lg:p-8">
            <main className="animate-fade-in">
              {children}
            </main>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;