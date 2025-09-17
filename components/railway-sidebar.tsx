"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LayoutDashboard, Train, AlertTriangle, Brain, FlaskConical, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "movements", label: "Train Movements", icon: Train },
  { id: "alerts", label: "Alerts & Incidents", icon: AlertTriangle },
  { id: "ai-recommendations", label: "AI Recommendations", icon: Brain },
  { id: "simulation", label: "Simulation Mode", icon: FlaskConical },
  { id: "settings", label: "Settings", icon: Settings },
]

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

export function RailwaySidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <IndianRailwaysLogo className="w-10 h-10" />
              <div>
                <h2 className="font-semibold text-sidebar-foreground">भारतीय रेल</h2>
                <p className="text-xs text-muted-foreground font-medium">Indian Railways</p>
                <p className="text-xs text-muted-foreground">Traffic Control System</p>
              </div>
            </motion.div>
          )}
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center w-full"
            >
              <IndianRailwaysLogo className="w-8 h-8" />
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center",
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-muted-foreground text-center"
            >
              <div className="font-medium">Railway Traffic Control</div>
              <div className="text-[10px] mt-1">Ministry of Railways, Govt. of India</div>
              <div className="text-[10px]">Version 2.1.0</div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
