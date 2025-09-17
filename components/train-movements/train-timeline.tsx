"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Users, Package, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrainMovement {
  id: string
  trainNumber: string
  trainName: string
  type: "passenger" | "express" | "freight"
  priority: "high" | "medium" | "low"
  status: "on-time" | "delayed" | "early" | "cancelled"
  route: {
    origin: string
    destination: string
    stations: string[]
  }
  schedule: {
    departure: string
    arrival: string
    duration: number
  }
  actual: {
    departure?: string
    currentLocation?: string
    estimatedArrival?: string
    delay?: number
  }
  passengers?: number
  cargo?: string
}

const mockTrainMovements: TrainMovement[] = [
  {
    id: "1",
    trainNumber: "12345",
    trainName: "Rajdhani Express",
    type: "express",
    priority: "high",
    status: "delayed",
    route: {
      origin: "New Delhi",
      destination: "Mumbai Central",
      stations: ["New Delhi", "Kanpur", "Jhansi", "Bhopal", "Nagpur", "Mumbai Central"],
    },
    schedule: {
      departure: "16:00",
      arrival: "08:30+1",
      duration: 16.5,
    },
    actual: {
      departure: "16:15",
      currentLocation: "Kanpur",
      estimatedArrival: "09:15+1",
      delay: 45,
    },
    passengers: 1200,
  },
  {
    id: "2",
    trainNumber: "67890",
    trainName: "Shatabdi Express",
    type: "express",
    priority: "high",
    status: "on-time",
    route: {
      origin: "Mumbai Central",
      destination: "New Delhi",
      stations: ["Mumbai Central", "Nagpur", "Bhopal", "Jhansi", "Kanpur", "New Delhi"],
    },
    schedule: {
      departure: "06:00",
      arrival: "22:30",
      duration: 16.5,
    },
    actual: {
      departure: "06:00",
      currentLocation: "Bhopal",
      estimatedArrival: "22:30",
      delay: 0,
    },
    passengers: 800,
  },
  {
    id: "3",
    trainNumber: "11111",
    trainName: "Freight Special",
    type: "freight",
    priority: "low",
    status: "early",
    route: {
      origin: "Nagpur",
      destination: "Mumbai Central",
      stations: ["Nagpur", "Wardha", "Akola", "Mumbai Central"],
    },
    schedule: {
      departure: "22:00",
      arrival: "14:00+1",
      duration: 16,
    },
    actual: {
      departure: "21:45",
      currentLocation: "Akola",
      estimatedArrival: "13:30+1",
      delay: -30,
    },
    cargo: "Coal - 2000T",
  },
  {
    id: "4",
    trainNumber: "22222",
    trainName: "Local Passenger",
    type: "passenger",
    priority: "medium",
    status: "on-time",
    route: {
      origin: "Bhopal",
      destination: "Nagpur",
      stations: ["Bhopal", "Betul", "Nagpur"],
    },
    schedule: {
      departure: "14:30",
      arrival: "20:15",
      duration: 5.75,
    },
    actual: {
      departure: "14:30",
      currentLocation: "Betul",
      estimatedArrival: "20:15",
      delay: 0,
    },
    passengers: 400,
  },
]

const statusColors = {
  "on-time": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  delayed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  early: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
}

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
}

const typeColors = {
  passenger: "bg-blue-500",
  express: "bg-red-500",
  freight: "bg-green-500",
}

export function TrainTimeline() {
  const [selectedTrain, setSelectedTrain] = useState<TrainMovement | null>(null)

  const getTimelinePosition = (train: TrainMovement) => {
    const startHour = 0
    const endHour = 24
    const departureHour = Number.parseInt(train.schedule.departure.split(":")[0])
    const arrivalHour = Number.parseInt(train.schedule.arrival.split(":")[0])

    const startPos = ((departureHour - startHour) / (endHour - startHour)) * 100
    const duration = train.schedule.duration
    const width = (duration / 24) * 100

    return { left: `${startPos}%`, width: `${width}%` }
  }

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <Card>
        <CardHeader>
          <CardTitle>Train Movement Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Time Scale */}
          <div className="relative mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              {Array.from({ length: 25 }, (_, i) => (
                <span key={i} className="w-8 text-center">
                  {i.toString().padStart(2, "0")}:00
                </span>
              ))}
            </div>
            <div className="h-px bg-border" />
          </div>

          {/* Train Timeline Bars */}
          <div className="space-y-3">
            {mockTrainMovements.map((train, index) => {
              const timelinePos = getTimelinePosition(train)

              return (
                <motion.div
                  key={train.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center gap-4 py-2">
                    {/* Train Info */}
                    <div className="w-48 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", typeColors[train.type])} />
                        <div>
                          <div className="font-medium text-sm">{train.trainName}</div>
                          <div className="text-xs text-muted-foreground">{train.trainNumber}</div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    <div className="flex-1 relative h-8">
                      <div className="absolute inset-0 bg-muted/20 rounded" />
                      <motion.div
                        className={cn(
                          "absolute h-full rounded flex items-center justify-center cursor-pointer",
                          train.status === "delayed" && "bg-red-500",
                          train.status === "on-time" && "bg-green-500",
                          train.status === "early" && "bg-blue-500",
                          train.status === "cancelled" && "bg-gray-500",
                        )}
                        style={timelinePos}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedTrain(train)}
                      >
                        <span className="text-xs text-white font-medium">
                          {train.schedule.departure} - {train.schedule.arrival}
                        </span>
                      </motion.div>

                      {/* Current Position Indicator */}
                      {train.actual.currentLocation && (
                        <motion.div
                          className="absolute top-0 w-1 h-full bg-primary"
                          style={{ left: "60%" }} // Simulated current position
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                      )}
                    </div>

                    {/* Status */}
                    <div className="w-24 flex-shrink-0">
                      <Badge className={cn("text-xs", statusColors[train.status])}>{train.status}</Badge>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Train Details */}
      {selectedTrain && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedTrain.trainName}</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTrain(null)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Train Number</div>
                  <div className="font-mono">{selectedTrain.trainNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <Badge className={cn("text-xs", typeColors[selectedTrain.type])}>{selectedTrain.type}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Priority</div>
                  <div className={cn("w-3 h-3 rounded-full inline-block", priorityColors[selectedTrain.priority])} />
                  <span className="ml-2 capitalize">{selectedTrain.priority}</span>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge className={cn("text-xs", statusColors[selectedTrain.status])}>{selectedTrain.status}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Route</div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  {selectedTrain.route.origin} → {selectedTrain.route.destination}
                </div>
                <div className="text-xs text-muted-foreground">
                  Via: {selectedTrain.route.stations.slice(1, -1).join(", ")}
                </div>
              </div>

              {selectedTrain.actual.delay !== undefined && selectedTrain.actual.delay !== 0 && (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">
                    {selectedTrain.actual.delay > 0 ? "Delayed" : "Running early"} by{" "}
                    {Math.abs(selectedTrain.actual.delay)} minutes
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Scheduled Departure</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedTrain.schedule.departure}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Actual Departure</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedTrain.actual.departure || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Scheduled Arrival</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedTrain.schedule.arrival}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Estimated Arrival</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedTrain.actual.estimatedArrival || "N/A"}
                  </div>
                </div>
              </div>

              {selectedTrain.actual.currentLocation && (
                <div>
                  <div className="text-sm text-muted-foreground">Current Location</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedTrain.actual.currentLocation}
                  </div>
                </div>
              )}

              {selectedTrain.passengers && (
                <div>
                  <div className="text-sm text-muted-foreground">Passengers</div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {selectedTrain.passengers.toLocaleString()}
                  </div>
                </div>
              )}

              {selectedTrain.cargo && (
                <div>
                  <div className="text-sm text-muted-foreground">Cargo</div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {selectedTrain.cargo}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
