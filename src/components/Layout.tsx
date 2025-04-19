
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, User, Home, MessageCircle, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) {
    return <>{children}</>;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: ImageIcon, label: "Submissions", path: "/submissions" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar h-screen fixed top-0 left-0 z-30 transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0 -translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
            <div className="text-cream-300 text-xl font-bold">Latte Art Meister</div>
          </div>
          
          <nav className="flex-1 py-6 px-4">
            <ul className="space-y-2">
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-coffee-700 text-cream-100">
                <User size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </div>
                <div className="text-xs text-sidebar-foreground/70 truncate">
                  {user.email}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-0"
      )}>
        <header className="sticky top-0 z-20 flex items-center h-16 px-6 bg-background/95 backdrop-blur border-b">
          <Button 
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-4"
          >
            <Menu size={18} />
          </Button>
          <div className="flex-1" />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
