"use client"

import { Bell, Search, User, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

function IndianRailwaysLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        {/* Outer circle */}
        <circle cx="20" cy="20" r="18" fill="#1e40af" stroke="#dc2626" strokeWidth="2" />

        {/* Railway wheel spokes */}
        <g stroke="#ffffff" strokeWidth="2" fill="none">
          <line x1="20" y1="4" x2="20" y2="36" />
          <line x1="4" y1="20" x2="36" y2="20" />
          <line x1="8.8" y1="8.8" x2="31.2" y2="31.2" />
          <line x1="31.2" y1="8.8" x2="8.8" y2="31.2" />
        </g>

        {/* Inner circle */}
        <circle cx="20" cy="20" r="6" fill="#dc2626" stroke="#ffffff" strokeWidth="1" />

        {/* Center dot */}
        <circle cx="20" cy="20" r="2" fill="#ffffff" />
      </svg>
    </div>
  )
}

export function RailwayHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 left-0 md:left-80 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-40"
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <div className="md:hidden flex items-center gap-2">
            <IndianRailwaysLogo className="w-8 h-8" />
            <div>
              <div className="text-sm font-semibold text-foreground">भारतीय रेल</div>
              <div className="text-xs text-muted-foreground">Traffic Control</div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search trains, stations..." className="pl-10 bg-muted/50" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 h-9">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
                <Sun className="h-4 w-4" />
                Light Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
                <Moon className="h-4 w-4" />
                Dark Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
                <Monitor className="h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative w-9 h-9">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
              3
            </Badge>
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Section Controller</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Shift Handover</DropdownMenuItem>
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
