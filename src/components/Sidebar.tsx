import { FileText, ListTodo, Users, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const navigation = [
    { name: "Leads", icon: Users, path: "/leads" },
    { name: "Notes", icon: FileText, path: "/notes" },
    { name: "Todo", icon: ListTodo, path: "/todo" }
  ];

  return (
    <aside className={cn(
      "bg-sidebar p-4 transition-all duration-300 z-50 flex-shrink-0",
      isMobile ? (
        isCollapsed ? "w-16 h-screen fixed" : "w-64 h-screen fixed"
      ) : (
        isCollapsed ? "w-16 h-screen" : "w-64 h-screen"
      ),
      isMobile && !isCollapsed && "shadow-xl"
    )}>
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed ? (
          <h1 className="text-white font-bold text-xl px-2 truncate">
            Kumbh Mela - Shreyas
          </h1>
        ) : (
          <h1 className="text-white font-bold text-sm px-1">
            KM
          </h1>
        )}
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
              onClick={() => isMobile && setIsCollapsed(true)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;