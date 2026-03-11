import { Home, PlusCircle, Activity, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: PlusCircle, label: "Add", path: "/add-item" },
    { icon: Activity, label: "Activity", path: "/activity" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover-elevate"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
