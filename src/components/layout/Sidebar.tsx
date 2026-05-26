import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Users,
  X,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "../../hooks/useNavigation";
import { useRouteLoadingContext } from "../../context/RouteLoadingContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Avatar } from "../ui/Avatar";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  // Mobile drawer controls
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const { navigateTo } = useNavigation();
  const { startLoading } = useRouteLoadingContext();
  const [expanded, setExpanded] = useLocalStorage("sidebar-expanded", true);

  const workspaceIdMatch = location.pathname.match(/\/workspace\/([^/]+)/);
  const currentWorkspaceId = workspaceIdMatch?.[1] ?? null;

  const taskNav = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: <Settings size={18} />,
    },
    ...(currentWorkspaceId
      ? [
          {
            to: `/workspace/${currentWorkspaceId}/members`,
            label: "Members",
            icon: <Users size={18} />,
          },
        ]
      : []),
    ...(currentWorkspaceId
      ? [
          {
            to: `/workspace/${currentWorkspaceId}/settings`,
            label: "Settings",
            icon: <Settings size={18} />,
          },
        ]
      : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigateTo("/login");
  };

  const handleNavClick = () => {
    startLoading();
    onClose?.(); // Close drawer on mobile after navigation
  };

  // ─── Shared sidebar content ────────────────────────────────
  const sidebarContent = (
    <>
      {/* Header */}
      <div className="relative flex h-16 items-center gap-3 px-4">
        <Link
          to="/dashboard"
          className="flex cursor-pointer items-center gap-2"
        >
          <span className="font-bold text-white">TaskFlow</span>
        </Link>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "absolute -right-3 z-10 hidden lg:flex",
            "size-6 items-center justify-center",
            "rounded-full border border-white/20 bg-gray-900",
            "text-gray-400 transition hover:text-white",
          )}
        >
          {expanded ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {taskNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                "hover:bg-white/5",
                isActive
                  ? "bg-white/5 text-cyan-300 ring-1 ring-cyan-500/30"
                  : "text-gray-400",
              )
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {/* Always show labels on mobile drawer, respect expanded on desktop */}
            <span className={cn(!expanded && "lg:hidden")}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-white/10 px-2 py-4">
        <button
          onClick={toggleTheme}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2",
            "text-sm text-gray-400 transition hover:bg-white/5 hover:text-white",
          )}
        >
          <span className="shrink-0">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </span>
          <span className={cn(!expanded && "lg:hidden")}>
            {isDark ? "Light mode" : "Dark mode"}
          </span>
        </button>

        <button
          onClick={handleSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2",
            "text-sm text-gray-400 transition hover:bg-white/5 hover:text-red-400",
          )}
        >
          <span className="shrink-0">
            <LogOut size={18} />
          </span>
          <span className={cn(!expanded && "lg:hidden")}>Sign out</span>
        </button>

        <div
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2",
            "text-sm transition hover:bg-white/5",
          )}
          onClick={() => {
            navigateTo("/profile");
            onClose?.();
          }}
        >
          <Avatar
            src={profile?.avatar_url}
            name={profile?.full_name}
            size="sm"
          />
          <div className={cn("min-w-0 flex-1", !expanded && "lg:hidden")}>
            <p className="truncate text-sm font-medium text-white">
              {profile?.full_name ?? "User"}
            </p>
            <p className="truncate text-xs text-gray-500">{profile?.email}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────── */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 hidden h-screen flex-col lg:flex",
          "border-r border-white/10 bg-gray-900",
          "transition-all duration-200",
          expanded ? "w-60" : "w-16",
        )}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col lg:hidden",
          "border-r border-white/10 bg-gray-900",
          "transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
