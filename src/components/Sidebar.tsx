import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  BarChart,
  FileText,
  FolderKanban,
  ListTodo,
  CheckSquare,
  Users,
  FileStack,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/leads", icon: Users, label: "Leads" },
    { path: "/leads/analytics", icon: BarChart, label: "Lead Analytics" },
    { path: "/notes", icon: FileText, label: "Notes" },
    { path: "/templates", icon: FolderKanban, label: "Templates" },
    { path: "/todo", icon: ListTodo, label: "Todo" },
    { path: "/completed-tasks", icon: CheckSquare, label: "Completed" },
    { path: "/files", icon: FileStack, label: "Files" },
  ];

  return (
    <div className="pb-12 min-h-screen w-full sm:w-64 bg-muted/40 border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Sales Navigator Pro</h2>
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {menuItems.map(({ path, icon: Icon, label }) => (
                <Button
                  key={path}
                  variant={isActive(path) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={path}>
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Link>
                </Button>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;