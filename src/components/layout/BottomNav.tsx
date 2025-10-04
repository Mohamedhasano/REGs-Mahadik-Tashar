import { NavLink, useLocation } from "react-router-dom";
import { Home, BarChart3, Activity, Wallet, User } from "lucide-react";

const items = [
  { label: "Home", to: "/", icon: Home },
  { label: "Markets", to: "/markets", icon: BarChart3 },
  { label: "Trade", to: "/trade", icon: Activity },
  { label: "Assets", to: "/assets", icon: Wallet },
  { label: "Profile", to: "/profile", icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-card nav-gradient border-t border-border backdrop-blur-md"
    >
      <ul className="flex items-stretch justify-between gap-1 px-2 py-1 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ label, to, icon: Icon }) => {
          const isActive = path === to;
          return (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className={() =>
                  [
                    "flex flex-col items-center justify-center gap-1 py-2 rounded-md",
                    "text-xs transition-colors font-medium",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  ].join(" ")
                }
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
