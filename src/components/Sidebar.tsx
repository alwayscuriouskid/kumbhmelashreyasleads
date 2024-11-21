import { FileText, ListTodo, Users, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navigation = [
    { name: "Leads", icon: Users, path: "/leads" },
    { name: "Notes", icon: FileText, path: "/notes" },
    { name: "Todo", icon: ListTodo, path: "/todo" }
  ];

  return (
    <div className={cn(
      "h-screen bg-sidebar fixed left-0 top-0 p-4 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between mb-8">
        <div className={cn(
          "text-white font-bold transition-all duration-300",
          isCollapsed ? "text-sm" : "text-xl px-4"
        )}>
          {isCollapsed ? "KM" : "Kumbh Mela - Shreyas"}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:text-gray-300 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-300 hover:bg-gray-700"
              )}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;