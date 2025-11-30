import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  Tag,
  DollarSign,
  LogOut,
  Menu,
  X,
  ChefHat,
  UtensilsCrossed,
  User,
  Moon,
  Sun,
  ChevronUp,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Order History", href: "/admin/orders", icon: ShoppingCart },
  { title: "Restaurants", href: "/admin/restaurants", icon: Store },
  { title: "Food Categories", href: "/admin/categories", icon: Tag },
  { title: "Withdrawal Requests", href: "/admin/withdrawals", icon: DollarSign },
];

const restaurantNavSections: NavSection[] = [
  {
    items: [{ title: "Dashboard", href: "/restaurant", icon: LayoutDashboard }],
  },
  {
    title: "Menu",
    items: [{ title: "Menu", href: "/restaurant/menu", icon: UtensilsCrossed }],
  },
  {
    title: "Orders",
    items: [
      { title: "Order History", href: "/restaurant/orders", icon: ShoppingCart },
      { title: "Today's Orders", href: "/restaurant/orders/today", icon: Package },
    ],
  },
  {
    title: "Restaurant Management",
    items: [
      { title: "Restaurant Profile", href: "/restaurant/profile", icon: Store },
    ],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  portalType: "admin" | "restaurant";
}

export function DashboardLayout({ children, portalType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Load persisted section state from localStorage
  const getInitialSections = (): Record<string, boolean> => {
    const defaults = {
      Menu: true,
      Orders: true,
      "Restaurant Management": true,
    };
    
    if (typeof window === "undefined") {
      return defaults;
    }
    
    const stored = localStorage.getItem(`sidebar-sections-${portalType}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all sections are present
        return { ...defaults, ...parsed };
      } catch {
        return defaults;
      }
    }
    return defaults;
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(getInitialSections);
  const location = useLocation();
  
  const portalTitle = portalType === "admin" ? "Tawfir Admin Portal" : "Restaurant Portal";
  const PortalIcon = portalType === "admin" ? ChefHat : Store;

  // Persist section state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`sidebar-sections-${portalType}`, JSON.stringify(openSections));
    }
  }, [openSections, portalType]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => {
      const newState = {
        ...prev,
        [sectionTitle]: !prev[sectionTitle],
      };
      return newState;
    });
  };

  const isItemActive = (href: string) => {
    if (href === "/restaurant") {
      return location.pathname === "/restaurant";
    }
    // Exact match for specific routes to avoid highlighting both "Order History" and "Today's Orders"
    if (href === "/restaurant/orders/today") {
      return location.pathname === "/restaurant/orders/today";
    }
    if (href === "/restaurant/orders") {
      return location.pathname === "/restaurant/orders" && location.pathname !== "/restaurant/orders/today";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            {portalType === "admin" ? (
              <>
                <img 
                  src="/logo.png" 
                  alt="Tawfir Logo" 
                  className="h-9 w-9 object-contain"
                />
                <span className="text-lg font-bold text-foreground">Admin Portal</span>
              </>
            ) : (
              <>
                <img 
                  src="/logo.png" 
                  alt="Tawfir Logo" 
                  className="h-9 w-9 object-contain"
                />
                <span className="text-lg font-bold text-foreground">{portalTitle}</span>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {portalType === "admin" ? (
              // Admin navigation (flat list)
              adminNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    />
                    {item.title}
                  </Link>
                );
              })
            ) : (
              // Restaurant navigation (with collapsible sections)
              restaurantNavSections.map((section, sectionIndex) => {
                // If no title, render items directly (Dashboard)
                if (!section.title) {
                  return section.items.map((item) => {
                    const isActive = isItemActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          )}
                        />
                        {item.title}
                      </Link>
                    );
                  });
                }

                // Render collapsible section
                const isOpen = section.title ? openSections[section.title] ?? true : false;
                const hasActiveItem = section.items.some((item) => isItemActive(item.href));

                return (
                  <Collapsible
                    key={section.title}
                    open={isOpen}
                    onOpenChange={() => toggleSection(section.title!)}
                  >
                    <CollapsibleTrigger
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground",
                        hasActiveItem && "text-foreground"
                      )}
                    >
                      <span>{section.title}</span>
                      <ChevronUp
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isOpen ? "rotate-0" : "rotate-180"
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      {section.items.map((item) => {
                        const isActive = isItemActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ml-2",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5 transition-colors",
                                isActive ? "text-primary-foreground" : "text-muted-foreground"
                              )}
                            />
                            {item.title}
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            )}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-md px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">AU</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@tawfir.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleDarkMode}>
                  {darkMode ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={portalType === "admin" ? "/admin/login" : "/login"} className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
