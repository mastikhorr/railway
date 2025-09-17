"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RecommendationCard } from "./recommendation-card"
import { Brain, Search, Filter } from "lucide-react"

interface Recommendation {
  id: string
  title: string
  description: string
  category: "routing" | "scheduling" | "maintenance" | "resource" | "safety"
  priority: "critical" | "high" | "medium" | "low"
  confidence: number
  estimatedImpact: {
    timeReduction: number
    costSaving: number
    efficiencyGain: number
    riskReduction: number
  }
  reasoning: {
    dataPoints: string[]
    analysis: string
    alternatives: string[]
  }
  implementation: {
    steps: string[]
    duration: string
    resources: string[]
    risks: string[]
  }
  affectedEntities: {
    trains: string[]
    stations: string[]
    routes: string[]
  }
  status: "pending" | "accepted" | "rejected" | "implemented"
  timestamp: string
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Optimize Route for Train 12345 via Alternative Track",
    description: "Reroute Rajdhani Express through less congested track B-7 to reduce delay by 25 minutes",
    category: "routing",
    priority: "high",
    confidence: 92,
    estimatedImpact: {
      timeReduction: 25,
      costSaving: 15,
      efficiencyGain: 12,
      riskReduction: 8,
    },
    reasoning: {
      dataPoints: [
        "Main line has 3 trains queued with average 15-minute delays",
        "Alternative track B-7 is currently clear with 95% reliability",
        "Historical data shows 5-minute travel time increase on B-7",
        "Weather conditions favorable for alternative route",
      ],
      analysis:
        "Current main line congestion analysis indicates significant delays. Alternative track B-7 offers optimal balance between time efficiency and operational safety. Machine learning models predict 92% success rate for this routing decision.",
      alternatives: ["Wait for main line clearance", "Use track C-3 (longer route)", "Delay departure by 30 minutes"],
    },
    implementation: {
      steps: [
        "Notify train crew of route change",
        "Update signaling system for track B-7",
        "Coordinate with stations along new route",
        "Monitor progress and adjust if needed",
      ],
      duration: "5 minutes",
      resources: ["Signal Controller", "Station Coordinators"],
      risks: ["Minor passenger confusion", "Slight fuel cost increase"],
    },
    affectedEntities: {
      trains: ["12345"],
      stations: ["Kanpur", "Jhansi", "Bhopal"],
      routes: ["B-7", "Main-Line-A"],
    },
    status: "pending",
    timestamp: "2024-01-15T15:30:00Z",
  },
  {
    id: "2",
    title: "Adjust Platform Assignment at Mumbai Central",
    description: "Move Express 67890 to Platform 3 for faster turnaround and improved passenger flow",
    category: "scheduling",
    priority: "medium",
    confidence: 87,
    estimatedImpact: {
      timeReduction: 12,
      costSaving: 8,
      efficiencyGain: 15,
      riskReduction: 5,
    },
    reasoning: {
      dataPoints: [
        "Platform 3 has 40% faster boarding times based on last 30 days",
        "Current platform assignment has 15-minute average turnaround",
        "Platform 3 closer to maintenance facilities by 200 meters",
        "Passenger flow analysis shows 25% improvement on Platform 3",
      ],
      analysis:
        "Platform utilization optimization based on real-time passenger flow data and historical performance metrics. Platform 3 offers superior operational efficiency with minimal disruption to existing schedules.",
      alternatives: ["Keep current platform", "Use Platform 5", "Delay for optimal platform availability"],
    },
    implementation: {
      steps: [
        "Update passenger information systems",
        "Notify ground staff of platform change",
        "Redirect passenger flow management",
        "Update train crew instructions",
      ],
      duration: "3 minutes",
      resources: ["Station Manager", "Ground Staff", "IT Systems"],
      risks: ["Passenger confusion", "Brief announcement delays"],
    },
    affectedEntities: {
      trains: ["67890"],
      stations: ["Mumbai Central"],
      routes: [],
    },
    status: "pending",
    timestamp: "2024-01-15T15:25:00Z",
  },
  {
    id: "3",
    title: "Preventive Maintenance Alert for Signal Box A-12",
    description: "Schedule immediate inspection of signal relay system showing early failure indicators",
    category: "maintenance",
    priority: "critical",
    confidence: 95,
    estimatedImpact: {
      timeReduction: 0,
      costSaving: 50,
      efficiencyGain: 0,
      riskReduction: 35,
    },
    reasoning: {
      dataPoints: [
        "Signal response time increased by 15% over last 48 hours",
        "Temperature sensors show 8°C above normal in relay cabinet",
        "Similar failures occurred in 3 other locations last month",
        "Predictive model indicates 78% failure probability within 24 hours",
      ],
      analysis:
        "Predictive maintenance algorithms have identified critical failure patterns in signal relay system. Immediate intervention can prevent major service disruption and ensure passenger safety.",
      alternatives: ["Wait for complete failure", "Reduce train frequency", "Implement manual signaling"],
    },
    implementation: {
      steps: [
        "Dispatch technical team immediately",
        "Prepare backup signaling equipment",
        "Coordinate with affected train schedules",
        "Implement temporary speed restrictions if needed",
      ],
      duration: "2 hours",
      resources: ["Signal Engineers", "Technical Team", "Backup Equipment"],
      risks: ["Service disruption during maintenance", "Weather dependency"],
    },
    affectedEntities: {
      trains: ["12345", "67890", "11111"],
      stations: ["Junction A-12"],
      routes: ["Main-Line-A", "Branch-B7"],
    },
    status: "pending",
    timestamp: "2024-01-15T15:20:00Z",
  },
]

export function RecommendationsDashboard() {
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null)

  const filteredRecommendations = recommendations.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || rec.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || rec.priority === priorityFilter

    return matchesSearch && matchesCategory && matchesPriority
  })

  const handleAccept = (id: string) => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, status: "accepted" as const } : rec)))
  }

  const handleReject = (id: string) => {
    setRecommendations((prev) => prev.map((rec) => (rec.id === id ? { ...rec, status: "rejected" as const } : rec)))
  }

  const handleViewDetails = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation)
  }

  const getStats = () => {
    const pending = recommendations.filter((r) => r.status === "pending").length
    const accepted = recommendations.filter((r) => r.status === "accepted").length
    const totalImpact = recommendations
      .filter((r) => r.status === "accepted")
      .reduce((sum, r) => sum + r.estimatedImpact.timeReduction, 0)

    return { pending, accepted, totalImpact }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.accepted}</div>
            <div className="text-sm text-muted-foreground">Accepted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalImpact}m</div>
            <div className="text-sm text-muted-foreground">Time Saved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search recommendations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="routing">Routing</SelectItem>
                <SelectItem value="scheduling">Scheduling</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RecommendationCard
              recommendation={recommendation}
              onAccept={handleAccept}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
            />
          </motion.div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No recommendations found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
