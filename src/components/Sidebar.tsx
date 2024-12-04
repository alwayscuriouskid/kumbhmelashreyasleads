import { Link, useLocation, useNavigate } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  BarChart,
  Users,
  Activity,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeaturePermission } from "@/hooks/useFeaturePermission";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: hasSalesProjectionAccess } = useFeaturePermission("sales_projection");

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  const baseMenuItems = [
    { path: "/leads", icon: Users, label: "Leads" },
    { path: "/leads/analytics", icon: BarChart, label: "Lead Analytics" },
    { path: "/team-activities", icon: Activity, label: "Team Activities" },
    { path: "/inventory", icon: Package, label: "Inventory" },
    { path: "/inventory/orders", icon: ShoppingCart, label: "Orders" },
  ];

  const salesProjectionItem = { 
    path: "/sales-projection", 
    icon: BarChart2, 
    label: "Sales Projection" 
  };

  const menuItems = hasSalesProjectionAccess 
    ? [...baseMenuItems, salesProjectionItem]
    : baseMenuItems;

  return (
    <div 
      className={cn(
        "h-full bg-muted/40 border-r transition-all duration-300 fixed top-0 left-0 z-40 flex flex-col",
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

      <div className="flex-1">
        <div className="px-3 py-2">
          {!isCollapsed && (
            <h2 className="mb-2 px-4 text-lg font-semibold truncate">Kumbhmela - Shreyas Leads</h2>
          )}
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-12rem)]">
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

      {/* Logout button at the bottom */}
      <div className="p-3 mt-auto border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed ? "px-2" : ""
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;