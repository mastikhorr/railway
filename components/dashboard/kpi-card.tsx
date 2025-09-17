"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  className?: string
}

export function KPICard({ title, value, change, changeType = "neutral", icon: Icon, className }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={cn("group", className)}
    >
      <Card className="h-full border-border/50 hover:border-border transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="space-y-1">
                <motion.p
                  className="text-2xl font-bold text-foreground"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {value}
                </motion.p>
                {change && (
                  <p
                    className={cn(
                      "text-xs font-medium",
                      changeType === "positive" && "text-green-600 dark:text-green-400",
                      changeType === "negative" && "text-red-600 dark:text-red-400",
                      changeType === "neutral" && "text-muted-foreground",
                    )}
                  >
                    {change}
                  </p>
                )}
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
