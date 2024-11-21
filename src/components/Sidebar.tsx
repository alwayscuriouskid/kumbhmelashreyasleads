import { FileText, ListTodo, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: "Leads", icon: Users, path: "/leads" },
    { name: "Notes", icon: FileText, path: "/notes" },
    { name: "Todo", icon: ListTodo, path: "/todo" }
  ];

  return (
    <div className="h-screen w-64 bg-sidebar fixed left-0 top-0 p-4">
      <div className="text-white text-xl font-bold mb-8 px-4">CRM Dashboard</div>
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;