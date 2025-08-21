import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Menu, 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  Users, 
  Settings, 
  CreditCard,
  LogOut,
  Bell,
  Search,
  Plus
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { Link } from "react-router-dom";

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, organization } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/app",
      icon: LayoutDashboard,
      current: location.pathname === "/app"
    },
    {
      name: "Templates",
      href: "/app/templates",
      icon: FileText,
      current: location.pathname.startsWith("/app/templates")
    },
    {
      name: "Vistorias", 
      href: "/app/inspections",
      icon: ClipboardCheck,
      current: location.pathname.startsWith("/app/inspections")
    },
    {
      name: "Equipe",
      href: "/app/settings/team", 
      icon: Users,
      current: location.pathname.startsWith("/app/settings/team")
    },
    {
      name: "Configurações",
      href: "/app/settings",
      icon: Settings,
      current: location.pathname.startsWith("/app/settings") && !location.pathname.startsWith("/app/settings/team")
    },
    {
      name: "Billing",
      href: "/app/billing",
      icon: CreditCard,
      current: location.pathname.startsWith("/app/billing")
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "free": return "secondary";
      case "starter": return "default";
      case "pro": return "secondary";
      case "business": return "destructive";
      default: return "outline";
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "free": return "Free";
      case "payg": return "Pay-per-Use";
      case "starter": return "Starter";
      case "pro": return "Pro";
      case "business": return "Business";
      default: return plan;
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <div className="font-bold text-lg">Vistoria Check</div>
                {organization && (
                  <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {organization.name}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex-shrink-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Plan Badge */}
        {!sidebarCollapsed && organization && (
          <div className="p-4">
            <Badge variant={getPlanBadgeColor(organization.plan)} className="w-full justify-center">
              Plano {getPlanName(organization.plan)}
            </Badge>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t p-4">
          {sidebarCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full h-8">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {user?.profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.profile?.name || "Usuário"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-2">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {user?.profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <div className="text-sm font-medium">
                      {user?.profile?.name || "Usuário"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user?.profile?.role || "inspector"}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.profile?.name || "Usuário"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">
                {navigation.find(item => item.current)?.name || "Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Search className="mr-2 h-4 w-4" />
                Buscar vistorias...
              </Button>
              
              {/* Quick Actions */}
              <Link to="/app/inspections/new">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Vistoria
                </Button>
              </Link>

              {/* Notifications */}
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;