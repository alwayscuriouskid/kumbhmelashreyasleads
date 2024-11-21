import { Search, Plus } from "lucide-react";
import Sidebar from "./Sidebar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <ScrollArea className="ml-16 lg:ml-64 h-screen">
        <div className="p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-gray-800 border-gray-700 w-full"
              />
            </div>
            <Button className="w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
          <main className="animate-fade-in overflow-x-auto">
            {children}
          </main>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Layout;