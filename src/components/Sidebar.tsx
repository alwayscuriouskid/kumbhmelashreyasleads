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
  Calendar,
  LineChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/leads", icon: Users, label: "Leads" },
    { path: "/leads/analytics", icon: BarChart, label: "Lead Analytics" },
    { path: "/team-activities", icon: Activity, label: "Team Activities" },
    { path: "/notes", icon: FileText, label: "Notes" },
    { path: "/templates", icon: FolderKanban, label: "Templates" },
    { path: "/todo", icon: ListTodo, label: "Todo" },
    { path: "/files", icon: FileStack, label: "Files" },
    { path: "/inventory", icon: Package, label: "Inventory" },
    { path: "/inventory/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/inventory/bookings", icon: Calendar, label: "Bookings" },
    { path: "/inventory/analytics", icon: LineChart, label: "Inventory Analytics" },
  ];

  return (
    <div 
      className={cn(
        "relative pb-12 min-h-screen bg-muted/40 border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-full sm:w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-[-12px] top-3 z-50 h-6 w-6 rounded-full border bg-background"
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
            <h2 className="mb-2 px-4 text-lg font-semibold">Kumbh Mela Leads</h2>
          )}
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {menuItems.map(({ path, icon: Icon, label }) => (
                <Button
                  key={path}
                  variant={isActive(path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isCollapsed && "px-2"
                  )}
                  asChild
                >
                  <Link to={path}>
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                    {!isCollapsed && label}
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