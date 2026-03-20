"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/clients": "Clients",
  "/topics": "Topics",
  "/submissions": "Submissions",
  "/offices": "Office Database",
  "/feed": "Feed",
  "/opportunities": "Opportunities",
  "/settings": "Settings",
  "/help": "Help",
};

interface TopbarProps {
  sidebarCollapsed: boolean;
}

export function Topbar({ sidebarCollapsed }: TopbarProps) {
  const pathname = usePathname();

  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      return [{ label: "Dashboard", href: "/" }];
    }
    const crumbs = [{ label: "Home", href: "/" }];
    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = breadcrumbMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ label, href: currentPath });
    }
    return crumbs;
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 transition-all duration-200",
        sidebarCollapsed ? "left-[68px]" : "left-[280px]"
      )}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.href}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-cool-grey-light" />}
            <span
              className={cn(
                i === breadcrumbs.length - 1
                  ? "font-medium text-gray-900"
                  : "text-cool-grey hover:text-gray-700 transition-colors duration-150"
              )}
            >
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <Button variant="ghost" size="sm" className="gap-2 text-cool-grey">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Search</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] font-medium text-cool-grey sm:flex">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-cool-grey">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-signal-blue" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 transition-colors duration-150 hover:bg-gray-100">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px]">JD</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">Jane Doe</span>
                <span className="text-xs text-cool-grey">jane@capiro.io</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-700">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
