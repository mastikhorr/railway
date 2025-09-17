"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowUpDown, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrainData {
  id: string
  trainNumber: string
  trainName: string
  type: "passenger" | "express" | "freight"
  status: "on-time" | "delayed" | "early" | "cancelled"
  origin: string
  destination: string
  departure: string
  arrival: string
  currentLocation: string
  delay: number
  passengers?: number
  cargo?: string
}

const mockTrainData: TrainData[] = [
  {
    id: "1",
    trainNumber: "12345",
    trainName: "Rajdhani Express",
    type: "express",
    status: "delayed",
    origin: "New Delhi",
    destination: "Mumbai Central",
    departure: "16:00",
    arrival: "08:30+1",
    currentLocation: "Kanpur",
    delay: 45,
    passengers: 1200,
  },
  {
    id: "2",
    trainNumber: "67890",
    trainName: "Shatabdi Express",
    type: "express",
    status: "on-time",
    origin: "Mumbai Central",
    destination: "New Delhi",
    departure: "06:00",
    arrival: "22:30",
    currentLocation: "Bhopal",
    delay: 0,
    passengers: 800,
  },
  {
    id: "3",
    trainNumber: "11111",
    trainName: "Freight Special",
    type: "freight",
    status: "early",
    origin: "Nagpur",
    destination: "Mumbai Central",
    departure: "22:00",
    arrival: "14:00+1",
    currentLocation: "Akola",
    delay: -30,
    cargo: "Coal - 2000T",
  },
  {
    id: "4",
    trainNumber: "22222",
    trainName: "Local Passenger",
    type: "passenger",
    status: "on-time",
    origin: "Bhopal",
    destination: "Nagpur",
    departure: "14:30",
    arrival: "20:15",
    currentLocation: "Betul",
    delay: 0,
    passengers: 400,
  },
  {
    id: "5",
    trainNumber: "33333",
    trainName: "Express Special",
    type: "express",
    status: "cancelled",
    origin: "Chennai",
    destination: "Bangalore",
    departure: "18:00",
    arrival: "23:30",
    currentLocation: "Chennai",
    delay: 0,
    passengers: 600,
  },
]

const statusColors = {
  "on-time": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  delayed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  early: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
}

const typeColors = {
  passenger: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  express: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  freight: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
}

export function TrainTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("trainNumber")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const filteredData = mockTrainData
    .filter((train) => {
      const matchesSearch =
        train.trainNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.destination.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "all" || train.type === typeFilter
      const matchesStatus = statusFilter === "all" || train.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof TrainData]
      const bValue = b[sortField as keyof TrainData]

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Train Movements Table</CardTitle>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search trains, stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Train Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="passenger">Passenger</SelectItem>
              <SelectItem value="express">Express</SelectItem>
              <SelectItem value="freight">Freight</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="on-time">On Time</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="early">Early</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("trainNumber")} className="h-8 p-0 font-medium">
                    Train
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("type")} className="h-8 p-0 font-medium">
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Route</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("departure")} className="h-8 p-0 font-medium">
                    Schedule
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("status")} className="h-8 p-0 font-medium">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("delay")} className="h-8 p-0 font-medium">
                    Delay
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Load</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((train, index) => (
                <motion.tr
                  key={train.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{train.trainName}</div>
                      <div className="text-sm text-muted-foreground font-mono">{train.trainNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", typeColors[train.type])}>{train.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{train.origin}</span>
                      <span className="text-muted-foreground">→</span>
                      <span>{train.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>
                        {train.departure} - {train.arrival}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      {train.currentLocation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", statusColors[train.status])}>{train.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        train.delay > 0 && "text-red-600 dark:text-red-400",
                        train.delay < 0 && "text-blue-600 dark:text-blue-400",
                        train.delay === 0 && "text-green-600 dark:text-green-400",
                      )}
                    >
                      {train.delay === 0 ? "On time" : `${train.delay > 0 ? "+" : ""}${train.delay}m`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {train.passengers && `${train.passengers.toLocaleString()} pax`}
                      {train.cargo && train.cargo}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No trains found matching your criteria</div>
        )}
      </CardContent>
    </Card>
  )
}
