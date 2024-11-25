import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  BarChart,
  FileText,
  FolderKanban,
  ListTodo,
  Users,
  FileStack,
  Activity,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/leads", icon: Users, label: "Leads" },
    { path: "/leads/analytics", icon: BarChart, label: "Lead Analytics" },
    { path: "/team-activities", icon: Activity, label: "Team Activities" },
    { path: "/notes", icon: FileText, label: "Notes" },
    { path: "/templates", icon: FolderKanban, label: "Templates" },
    { path: "/trash", icon: Trash2, label: "Trash" },
    { path: "/todo", icon: ListTodo, label: "Todo" },
    { path: "/files", icon: FileStack, label: "Files" },
    { path: "/inventory", icon: Package, label: "Inventory" },
    { path: "/inventory/orders", icon: ShoppingCart, label: "Orders" },
  ];

  return (
    <div 
      className={cn(
        "h-full bg-muted/40 border-r transition-all duration-300 fixed top-0 left-0 z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-[-12px] top-3 z-50 h-6 w-6 rounded-full border bg-background hidden sm:flex"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {!isCollapsed && (
            <h2 className="mb-2 px-4 text-lg font-semibold truncate">Kumbh Mela Leads</h2>
          )}
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {menuItems.map(({ path, icon: Icon, label }) => (
                <Button
                  key={path}
                  variant={isActive(path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isCollapsed ? "px-2" : ""
                  )}
                  asChild
                >
                  <Link to={path}>
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span className="truncate">{label}</span>}
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