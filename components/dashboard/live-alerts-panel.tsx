"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Clock, MapPin, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Alert {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low"
  location: string
  time: string
  type: "delay" | "weather" | "technical" | "signal"
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Signal Failure at Junction A-12",
    description: "Automatic signaling system malfunction causing delays",
    severity: "high",
    location: "New Delhi - Mumbai Route",
    time: "2 min ago",
    type: "signal",
  },
  {
    id: "2",
    title: "Weather Advisory - Heavy Rain",
    description: "Reduced visibility affecting train speeds",
    severity: "medium",
    location: "Mumbai - Pune Section",
    time: "15 min ago",
    type: "weather",
  },
  {
    id: "3",
    title: "Train 12345 Running Late",
    description: "Rajdhani Express delayed by 45 minutes",
    severity: "medium",
    location: "Kanpur Junction",
    time: "32 min ago",
    type: "delay",
  },
  {
    id: "4",
    title: "Track Maintenance Complete",
    description: "Scheduled maintenance finished ahead of time",
    severity: "low",
    location: "Chennai - Bangalore Route",
    time: "1 hour ago",
    type: "technical",
  },
]

const severityColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
}

export function LiveAlertsPanel() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          Live Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-6 pt-0">
            {mockAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                        {alert.title}
                      </h4>
                      <Badge className={cn("text-xs", severityColors[alert.severity])}>{alert.severity}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full bg-transparent" size="sm">
            View All Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
