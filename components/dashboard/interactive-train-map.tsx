"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw, Train, MapPin, Clock, Users, Package, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrainPosition {
  id: string
  number: string
  name: string
  type: "passenger" | "express" | "freight"
  status: "on-time" | "delayed" | "early"
  x: number
  y: number
  speed: number
  destination: string
  delay?: number
  passengers?: number
  cargo?: string
  route: { x: number; y: number }[]
  currentRouteIndex: number
  direction: number // angle in degrees
}

interface Station {
  id: string
  name: string
  code: string
  x: number
  y: number
  type: "major" | "junction" | "terminal"
}

interface RouteSegment {
  id: string
  from: { x: number; y: number }
  to: { x: number; y: number }
  congestion: "low" | "medium" | "high"
}

const mockStations: Station[] = [
  { id: "1", name: "New Delhi", code: "NDLS", x: 200, y: 150, type: "terminal" },
  { id: "2", name: "Mumbai Central", code: "BCT", x: 100, y: 400, type: "terminal" },
  { id: "3", name: "Kanpur Central", code: "CNB", x: 250, y: 200, type: "junction" },
  { id: "4", name: "Nagpur", code: "NGP", x: 200, y: 300, type: "junction" },
  { id: "5", name: "Bhopal", code: "BPL", x: 150, y: 250, type: "major" },
  { id: "6", name: "Jhansi", code: "JHS", x: 220, y: 220, type: "major" },
]

const mockRoutes: RouteSegment[] = [
  { id: "1", from: { x: 200, y: 150 }, to: { x: 250, y: 200 }, congestion: "medium" },
  { id: "2", from: { x: 250, y: 200 }, to: { x: 220, y: 220 }, congestion: "low" },
  { id: "3", from: { x: 220, y: 220 }, to: { x: 150, y: 250 }, congestion: "high" },
  { id: "4", from: { x: 150, y: 250 }, to: { x: 200, y: 300 }, congestion: "medium" },
  { id: "5", from: { x: 200, y: 300 }, to: { x: 100, y: 400 }, congestion: "low" },
]

const mockTrains: TrainPosition[] = [
  {
    id: "1",
    number: "12345",
    name: "Rajdhani Express",
    type: "express",
    status: "delayed",
    x: 200,
    y: 150,
    speed: 85,
    destination: "Mumbai Central",
    delay: 15,
    passengers: 1200,
    route: [
      { x: 200, y: 150 },
      { x: 250, y: 200 },
      { x: 220, y: 220 },
      { x: 150, y: 250 },
      { x: 200, y: 300 },
      { x: 100, y: 400 },
    ],
    currentRouteIndex: 0,
    direction: 45,
  },
  {
    id: "2",
    number: "67890",
    name: "Shatabdi Express",
    type: "express",
    status: "on-time",
    x: 100,
    y: 400,
    speed: 95,
    destination: "New Delhi",
    passengers: 800,
    route: [
      { x: 100, y: 400 },
      { x: 200, y: 300 },
      { x: 150, y: 250 },
      { x: 220, y: 220 },
      { x: 250, y: 200 },
      { x: 200, y: 150 },
    ],
    currentRouteIndex: 0,
    direction: -135,
  },
  {
    id: "3",
    number: "11111",
    name: "Freight Special",
    type: "freight",
    status: "early",
    x: 150,
    y: 250,
    speed: 45,
    destination: "Nagpur",
    cargo: "Coal - 2000T",
    route: [
      { x: 150, y: 250 },
      { x: 200, y: 300 },
      { x: 220, y: 320 },
      { x: 180, y: 350 },
    ],
    currentRouteIndex: 0,
    direction: 30,
  },
  {
    id: "4",
    number: "22222",
    name: "Local Passenger",
    type: "passenger",
    status: "on-time",
    x: 220,
    y: 220,
    speed: 60,
    destination: "Bhopal",
    passengers: 400,
    route: [
      { x: 220, y: 220 },
      { x: 150, y: 250 },
      { x: 130, y: 270 },
      { x: 140, y: 290 },
    ],
    currentRouteIndex: 0,
    direction: -45,
  },
]

const trainTypeColors = {
  passenger: "bg-blue-500",
  express: "bg-red-500",
  freight: "bg-green-500",
}

const statusColors = {
  "on-time": "border-green-400",
  delayed: "border-red-400",
  early: "border-blue-400",
}

const congestionColors = {
  low: "stroke-green-400",
  medium: "stroke-yellow-400",
  high: "stroke-red-400",
}

export function InteractiveTrainMap() {
  const [selectedTrain, setSelectedTrain] = useState<TrainPosition | null>(null)
  const [zoom, setZoom] = useState(1)
  const [trains, setTrains] = useState(mockTrains)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setTrains((prevTrains) =>
        prevTrains.map((train) => {
          const nextIndex = (train.currentRouteIndex + 1) % train.route.length
          const nextPosition = train.route[nextIndex]
          const currentPosition = train.route[train.currentRouteIndex]

          const dx = nextPosition.x - currentPosition.x
          const dy = nextPosition.y - currentPosition.y
          const direction = Math.atan2(dy, dx) * (180 / Math.PI)

          const progress = 0.3
          const newX = currentPosition.x + (nextPosition.x - currentPosition.x) * progress
          const newY = currentPosition.y + (nextPosition.y - currentPosition.y) * progress

          const distance = Math.sqrt(Math.pow(nextPosition.x - newX, 2) + Math.pow(nextPosition.y - newY, 2))

          return {
            ...train,
            x: newX,
            y: newY,
            direction,
            currentRouteIndex: distance < 5 ? nextIndex : train.currentRouteIndex,
          }
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [isAnimating])

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5))
  const handleReset = () => {
    setZoom(1)
    setSelectedTrain(null)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Live Train Network
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAnimating(!isAnimating)} className="gap-2">
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAnimating ? "Pause" : "Play"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[400px] overflow-hidden bg-muted/20 rounded-b-lg">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: zoom }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "center center" }}
          >
            <svg className="absolute inset-0 w-full h-full">
              {mockRoutes.map((route) => (
                <motion.line
                  key={route.id}
                  x1={route.from.x}
                  y1={route.from.y}
                  x2={route.to.x}
                  y2={route.to.y}
                  className={cn("stroke-2", congestionColors[route.congestion])}
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              ))}
            </svg>

            {mockStations.map((station, index) => (
              <motion.div
                key={station.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: station.x, top: station.y }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative group">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full border-2 border-foreground",
                      station.type === "terminal" && "bg-primary",
                      station.type === "junction" && "bg-secondary",
                      station.type === "major" && "bg-accent",
                    )}
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-popover border border-border rounded-md px-2 py-1 text-xs whitespace-nowrap">
                      <div className="font-medium">{station.name}</div>
                      <div className="text-muted-foreground">{station.code}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {trains.map((train, index) => (
                <motion.div
                  key={train.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: train.x, top: train.y }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{
                    scale: selectedTrain?.id === train.id ? 1.3 : 1,
                    rotate: train.direction,
                    x: 0,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    rotate: { duration: 0.5 },
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedTrain(train)}
                >
                  <div
                    className={cn(
                      "relative w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      trainTypeColors[train.type],
                      statusColors[train.status],
                    )}
                  >
                    <Train className="w-3 h-3 text-white" />

                    {isAnimating && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-current opacity-30"
                        animate={{
                          scale: [1, 2, 1],
                          opacity: [0.3, 0, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="bg-background border border-border rounded px-1 text-xs font-mono">
                        {train.speed}
                      </div>
                    </div>

                    {train.status === "delayed" && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="absolute top-4 left-4 bg-card/95 backdrop-blur border border-border rounded-lg p-3 space-y-2">
            <div className="text-xs font-medium mb-2">Train Types</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                Express
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                Passenger
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                Freight
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs">
                {isAnimating ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                )}
                {isAnimating ? "Live" : "Paused"}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {selectedTrain && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="absolute top-4 right-4 bg-card/95 backdrop-blur border border-border rounded-lg p-4 w-64"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{selectedTrain.name}</h4>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTrain(null)} className="h-6 w-6 p-0">
                      ×
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Train No:</span>
                      <span className="font-mono">{selectedTrain.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge className={cn("text-xs", trainTypeColors[selectedTrain.type])}>{selectedTrain.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className={cn("text-xs", statusColors[selectedTrain.status])}>
                        {selectedTrain.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Speed:</span>
                      <span>{selectedTrain.speed} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="text-right">{selectedTrain.destination}</span>
                    </div>

                    {selectedTrain.delay && (
                      <div className="flex justify-between text-red-600 dark:text-red-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Delay:
                        </span>
                        <span>{selectedTrain.delay} min</span>
                      </div>
                    )}

                    {selectedTrain.passengers && (
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-3 h-3" />
                          Passengers:
                        </span>
                        <span>{selectedTrain.passengers}</span>
                      </div>
                    )}

                    {selectedTrain.cargo && (
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Package className="w-3 h-3" />
                          Cargo:
                        </span>
                        <span className="text-right text-xs">{selectedTrain.cargo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
