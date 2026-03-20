"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Send,
  Building2,
  Rss,
  Lightbulb,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Topics", href: "/topics", icon: FileText },
  { label: "Submissions", href: "/submissions", icon: Send },
];

const intelligenceNav: NavItem[] = [
  { label: "Office Database", href: "/offices", icon: Building2 },
  { label: "Feed", href: "/feed", icon: Rss },
  { label: "Opportunities", href: "/opportunities", icon: Lightbulb },
];

const systemNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-200",
          collapsed ? "w-[68px]" : "w-[280px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-capiro-blue">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-capiro-blue animate-fadeIn">
                Capiro
              </span>
            )}
          </Link>
          <button
            onClick={onToggle}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md text-cool-grey hover:bg-gray-100 transition-colors duration-150",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-6 px-3">
            <NavSection label="Main" items={mainNav} pathname={pathname} collapsed={collapsed} />
            <Separator />
            <NavSection label="Intelligence" items={intelligenceNav} pathname={pathname} collapsed={collapsed} />
            <Separator />
            <NavSection label="System" items={systemNav} pathname={pathname} collapsed={collapsed} />
          </nav>
        </ScrollArea>

        {/* User */}
        <div className="border-t border-gray-200 p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg p-2 transition-colors duration-150 hover:bg-gray-50",
              collapsed && "justify-center"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-[10px]">JD</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 animate-fadeIn">
                <p className="truncate text-sm font-medium text-gray-900">Jane Doe</p>
                <p className="truncate text-xs text-cool-grey">jane@capiro.io</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

function NavSection({
  label,
  items,
  pathname,
  collapsed,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
  collapsed: boolean;
}) {
  return (
    <div className="space-y-1">
      {!collapsed && (
        <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-cool-grey-light">
          {label}
        </p>
      )}
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        const linkContent = (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-signal-blue-light text-signal-blue"
                : "text-cool-grey hover:bg-gray-100 hover:text-gray-900",
              collapsed && "justify-center px-2"
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-signal-blue" />
            )}
            <item.icon className={cn("h-[18px] w-[18px] shrink-0")} />
            {!collapsed && <span className="animate-fadeIn">{item.label}</span>}
          </Link>
        );

        if (collapsed) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        }

        return <React.Fragment key={item.href}>{linkContent}</React.Fragment>;
      })}
    </div>
  );
}
