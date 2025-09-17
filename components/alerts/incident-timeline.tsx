"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  CloudRain,
  Wrench,
  Signal,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Incident {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "active" | "investigating" | "resolved" | "closed"
  type: "signal" | "weather" | "technical" | "delay" | "accident" | "maintenance"
  location: string
  reportedBy: string
  reportedAt: string
  resolvedAt?: string
  affectedTrains: string[]
  estimatedImpact: string
  actions: {
    id: string
    action: string
    timestamp: string
    user: string
  }[]
  updates: {
    id: string
    message: string
    timestamp: string
    user: string
  }[]
}

const mockIncidents: Incident[] = [
  {
    id: "1",
    title: "Signal System Malfunction at Junction A-12",
    description: "Automatic signaling system experiencing intermittent failures causing train delays",
    severity: "critical",
    status: "investigating",
    type: "signal",
    location: "New Delhi - Mumbai Route, Junction A-12",
    reportedBy: "Station Master - Junction A-12",
    reportedAt: "2024-01-15T14:30:00Z",
    affectedTrains: ["12345", "67890", "11111"],
    estimatedImpact: "45-60 min delays expected",
    actions: [
      { id: "1", action: "Dispatched technical team", timestamp: "2024-01-15T14:35:00Z", user: "Control Room" },
      { id: "2", action: "Activated manual signaling", timestamp: "2024-01-15T14:40:00Z", user: "Signal Engineer" },
    ],
    updates: [
      { id: "1", message: "Technical team arrived on site", timestamp: "2024-01-15T15:00:00Z", user: "Field Engineer" },
      {
        id: "2",
        message: "Identified faulty relay in signal box",
        timestamp: "2024-01-15T15:15:00Z",
        user: "Signal Technician",
      },
    ],
  },
  {
    id: "2",
    title: "Heavy Rainfall Alert - Mumbai Section",
    description: "Monsoon rains causing reduced visibility and track flooding in multiple sections",
    severity: "high",
    status: "active",
    type: "weather",
    location: "Mumbai - Pune Section",
    reportedBy: "Weather Monitoring System",
    reportedAt: "2024-01-15T13:15:00Z",
    affectedTrains: ["22222", "33333"],
    estimatedImpact: "Speed restrictions, 15-30 min delays",
    actions: [
      {
        id: "1",
        action: "Issued speed restriction order",
        timestamp: "2024-01-15T13:20:00Z",
        user: "Traffic Controller",
      },
      { id: "2", action: "Activated drainage pumps", timestamp: "2024-01-15T13:25:00Z", user: "Maintenance Team" },
    ],
    updates: [
      { id: "1", message: "Rainfall intensity increasing", timestamp: "2024-01-15T13:45:00Z", user: "Weather Station" },
      { id: "2", message: "Track water level at 15cm", timestamp: "2024-01-15T14:00:00Z", user: "Track Inspector" },
    ],
  },
  {
    id: "3",
    title: "Train 12345 Mechanical Failure",
    description: "Rajdhani Express reporting engine overheating, stopped at Kanpur Junction",
    severity: "high",
    status: "resolved",
    type: "technical",
    location: "Kanpur Junction",
    reportedBy: "Loco Pilot - Train 12345",
    reportedAt: "2024-01-15T11:20:00Z",
    resolvedAt: "2024-01-15T13:45:00Z",
    affectedTrains: ["12345"],
    estimatedImpact: "2.5 hour delay",
    actions: [
      { id: "1", action: "Emergency stop authorized", timestamp: "2024-01-15T11:22:00Z", user: "Control Room" },
      { id: "2", action: "Replacement engine dispatched", timestamp: "2024-01-15T11:30:00Z", user: "Loco Shed" },
      { id: "3", action: "Engine replacement completed", timestamp: "2024-01-15T13:30:00Z", user: "Technical Team" },
    ],
    updates: [
      {
        id: "1",
        message: "Passengers provided refreshments",
        timestamp: "2024-01-15T12:00:00Z",
        user: "Station Manager",
      },
      { id: "2", message: "Replacement engine coupled", timestamp: "2024-01-15T13:35:00Z", user: "Loco Pilot" },
      { id: "3", message: "Train departed Kanpur", timestamp: "2024-01-15T13:45:00Z", user: "Station Controller" },
    ],
  },
  {
    id: "4",
    title: "Scheduled Track Maintenance - Section B7",
    description: "Planned rail replacement work on main line",
    severity: "medium",
    status: "active",
    type: "maintenance",
    location: "Chennai - Bangalore Route, Section B7",
    reportedBy: "Maintenance Supervisor",
    reportedAt: "2024-01-15T06:00:00Z",
    affectedTrains: ["44444", "55555"],
    estimatedImpact: "Single line working, 10-15 min delays",
    actions: [
      {
        id: "1",
        action: "Traffic diverted to parallel track",
        timestamp: "2024-01-15T06:05:00Z",
        user: "Traffic Controller",
      },
      {
        id: "2",
        action: "Speed restriction implemented",
        timestamp: "2024-01-15T06:10:00Z",
        user: "Section Controller",
      },
    ],
    updates: [
      { id: "1", message: "50% work completed", timestamp: "2024-01-15T10:00:00Z", user: "Maintenance Team" },
      { id: "2", message: "Expected completion by 16:00", timestamp: "2024-01-15T12:00:00Z", user: "Site Engineer" },
    ],
  },
]

const severityColors = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
}

const statusColors = {
  active: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  investigating: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
}

const typeIcons = {
  signal: Signal,
  weather: CloudRain,
  technical: Wrench,
  delay: Clock,
  accident: AlertTriangle,
  maintenance: Wrench,
}

export function IncidentTimeline() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null)

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getTimeSince = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Incident Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {mockIncidents.map((incident, index) => {
                const TypeIcon = typeIcons[incident.type]
                const isExpanded = expandedIncident === incident.id

                return (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "border rounded-lg p-4 space-y-3 cursor-pointer transition-all",
                      severityColors[incident.severity],
                      isExpanded && "ring-2 ring-primary/20",
                    )}
                    onClick={() => setExpandedIncident(isExpanded ? null : incident.id)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-background/50 rounded-lg">
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-sm">{incident.title}</h4>
                            <Badge className={cn("text-xs", severityColors[incident.severity])}>
                              {incident.severity}
                            </Badge>
                            <Badge className={cn("text-xs", statusColors[incident.status])}>{incident.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{incident.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {incident.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {getTimeSince(incident.reportedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {incident.reportedBy}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedIncident(incident)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-3 border-t border-border/50"
                        >
                          {/* Impact & Affected Trains */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="text-muted-foreground mb-1">Estimated Impact</div>
                              <div className="font-medium">{incident.estimatedImpact}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-1">Affected Trains</div>
                              <div className="flex gap-1 flex-wrap">
                                {incident.affectedTrains.map((train) => (
                                  <Badge key={train} variant="outline" className="text-xs">
                                    {train}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Recent Actions */}
                          <div>
                            <div className="text-muted-foreground text-xs mb-2">Recent Actions</div>
                            <div className="space-y-1">
                              {incident.actions.slice(-2).map((action) => (
                                <div key={action.id} className="flex items-center gap-2 text-xs">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span>{action.action}</span>
                                  <span className="text-muted-foreground">
                                    - {formatTime(action.timestamp)} by {action.user}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Latest Updates */}
                          <div>
                            <div className="text-muted-foreground text-xs mb-2">Latest Updates</div>
                            <div className="space-y-1">
                              {incident.updates.slice(-2).map((update) => (
                                <div key={update.id} className="flex items-center gap-2 text-xs">
                                  <MessageSquare className="w-3 h-3 text-blue-500" />
                                  <span>{update.message}</span>
                                  <span className="text-muted-foreground">
                                    - {formatTime(update.timestamp)} by {update.user}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Detailed Incident Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedIncident(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {(() => {
                        const TypeIcon = typeIcons[selectedIncident.type]
                        return <TypeIcon className="w-5 h-5 text-primary" />
                      })()}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedIncident.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={cn("text-xs", severityColors[selectedIncident.severity])}>
                          {selectedIncident.severity}
                        </Badge>
                        <Badge className={cn("text-xs", statusColors[selectedIncident.status])}>
                          {selectedIncident.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedIncident(null)}>
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="max-h-[60vh]">
                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Incident Details</h3>
                        <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Location</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          {selectedIncident.location}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Reported By</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-primary" />
                          {selectedIncident.reportedBy}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Timeline</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reported:</span>
                            <span>
                              {formatDate(selectedIncident.reportedAt)} {formatTime(selectedIncident.reportedAt)}
                            </span>
                          </div>
                          {selectedIncident.resolvedAt && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Resolved:</span>
                              <span>
                                {formatDate(selectedIncident.resolvedAt)} {formatTime(selectedIncident.resolvedAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Impact</h3>
                        <p className="text-sm">{selectedIncident.estimatedImpact}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Affected Trains</h3>
                        <div className="flex gap-1 flex-wrap">
                          {selectedIncident.affectedTrains.map((train) => (
                            <Badge key={train} variant="outline">
                              {train}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Timeline */}
                  <div>
                    <h3 className="font-medium mb-4">Actions Taken</h3>
                    <div className="space-y-3">
                      {selectedIncident.actions.map((action) => (
                        <div key={action.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{action.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(action.timestamp)} {formatTime(action.timestamp)} by {action.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Updates Timeline */}
                  <div>
                    <h3 className="font-medium mb-4">Status Updates</h3>
                    <div className="space-y-3">
                      {selectedIncident.updates.map((update) => (
                        <div key={update.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{update.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(update.timestamp)} {formatTime(update.timestamp)} by {update.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
