"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimulationResult {
  id: string
  scenarioName: string
  status: "completed" | "running" | "failed"
  startTime: string
  endTime?: string
  metrics: {
    before: {
      averageDelay: number
      punctuality: number
      throughput: number
      utilization: number
      incidents: number
    }
    after: {
      averageDelay: number
      punctuality: number
      throughput: number
      utilization: number
      incidents: number
    }
  }
  impactAnalysis: {
    timeImpact: number
    costImpact: number
    efficiencyImpact: number
    riskImpact: number
  }
  affectedTrains: string[]
  recommendations: string[]
}

const mockResults: SimulationResult[] = [
  {
    id: "1",
    scenarioName: "Heavy Rain Impact Test",
    status: "completed",
    startTime: "2024-01-15T14:30:00Z",
    endTime: "2024-01-15T14:33:00Z",
    metrics: {
      before: {
        averageDelay: 12.5,
        punctuality: 87.2,
        throughput: 64,
        utilization: 78.9,
        incidents: 2,
      },
      after: {
        averageDelay: 18.3,
        punctuality: 79.1,
        throughput: 52,
        utilization: 85.2,
        incidents: 5,
      },
    },
    impactAnalysis: {
      timeImpact: -5.8,
      costImpact: -12.5,
      efficiencyImpact: -8.1,
      riskImpact: 15.2,
    },
    affectedTrains: ["12345", "67890", "11111", "22222"],
    recommendations: [
      "Implement speed restrictions during heavy rain",
      "Increase buffer time for weather-sensitive routes",
      "Deploy additional drainage equipment",
      "Consider alternative routing for express trains",
    ],
  },
  {
    id: "2",
    scenarioName: "Alternative Route Optimization",
    status: "completed",
    startTime: "2024-01-15T15:00:00Z",
    endTime: "2024-01-15T15:02:00Z",
    metrics: {
      before: {
        averageDelay: 12.5,
        punctuality: 87.2,
        throughput: 64,
        utilization: 78.9,
        incidents: 2,
      },
      after: {
        averageDelay: 8.7,
        punctuality: 92.4,
        throughput: 68,
        utilization: 74.3,
        incidents: 1,
      },
    },
    impactAnalysis: {
      timeImpact: 3.8,
      costImpact: 8.2,
      efficiencyImpact: 5.2,
      riskImpact: -4.6,
    },
    affectedTrains: ["12345", "67890"],
    recommendations: [
      "Implement dynamic routing based on real-time congestion",
      "Update passenger information systems for route changes",
      "Train staff on alternative route procedures",
      "Monitor fuel consumption on alternative routes",
    ],
  },
]

const performanceData = [
  { metric: "Avg Delay", before: 12.5, after: 8.7, unit: "min" },
  { metric: "Punctuality", before: 87.2, after: 92.4, unit: "%" },
  { metric: "Throughput", before: 64, after: 68, unit: "/hr" },
  { metric: "Utilization", before: 78.9, after: 74.3, unit: "%" },
]

export function SimulationResults() {
  const [selectedResult, setSelectedResult] = useState<SimulationResult | null>(mockResults[0])

  const getImpactColor = (value: number) => {
    if (value > 0) return "text-green-600 dark:text-green-400"
    if (value < 0) return "text-red-600 dark:text-red-400"
    return "text-muted-foreground"
  }

  const getImpactIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4" />
    if (value < 0) return <TrendingDown className="w-4 h-4" />
    return null
  }

  const formatDuration = (start: string, end?: string) => {
    if (!end) return "Running..."
    const duration = new Date(end).getTime() - new Date(start).getTime()
    return `${Math.round(duration / 1000)}s`
  }

  return (
    <div className="space-y-6">
      {/* Results List */}
      <Card>
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-all",
                  selectedResult?.id === result.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80",
                )}
                onClick={() => setSelectedResult(result)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {result.status === "completed" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : result.status === "running" ? (
                        <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{result.scenarioName}</h4>
                      <div className="text-sm text-muted-foreground">
                        Duration: {formatDuration(result.startTime, result.endTime)} • {result.affectedTrains.length}{" "}
                        trains affected
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      result.status === "completed" &&
                        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                      result.status === "running" && "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                      result.status === "failed" && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                    )}
                  >
                    {result.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      {selectedResult && (
        <motion.div
          key={selectedResult.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Impact Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getImpactIcon(selectedResult.impactAnalysis.timeImpact)}
                  <span className={cn("text-lg font-bold", getImpactColor(selectedResult.impactAnalysis.timeImpact))}>
                    {selectedResult.impactAnalysis.timeImpact > 0 ? "+" : ""}
                    {selectedResult.impactAnalysis.timeImpact}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Time Impact</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getImpactIcon(selectedResult.impactAnalysis.costImpact)}
                  <span className={cn("text-lg font-bold", getImpactColor(selectedResult.impactAnalysis.costImpact))}>
                    {selectedResult.impactAnalysis.costImpact > 0 ? "+" : ""}
                    {selectedResult.impactAnalysis.costImpact}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Cost Impact</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getImpactIcon(selectedResult.impactAnalysis.efficiencyImpact)}
                  <span
                    className={cn("text-lg font-bold", getImpactColor(selectedResult.impactAnalysis.efficiencyImpact))}
                  >
                    {selectedResult.impactAnalysis.efficiencyImpact > 0 ? "+" : ""}
                    {selectedResult.impactAnalysis.efficiencyImpact}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Efficiency Impact</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getImpactIcon(selectedResult.impactAnalysis.riskImpact)}
                  <span className={cn("text-lg font-bold", getImpactColor(selectedResult.impactAnalysis.riskImpact))}>
                    {selectedResult.impactAnalysis.riskImpact > 0 ? "+" : ""}
                    {selectedResult.impactAnalysis.riskImpact}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Risk Impact</div>
              </CardContent>
            </Card>
          </div>

          {/* Before/After Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Before vs After Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="chart">Chart View</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>

                <TabsContent value="chart" className="space-y-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="metric" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="before" fill="hsl(var(--muted))" name="Before" />
                        <Bar dataKey="after" fill="hsl(var(--primary))" name="After" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="table" className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-2">Metric</th>
                          <th className="text-center p-2">Before</th>
                          <th className="text-center p-2">After</th>
                          <th className="text-center p-2">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performanceData.map((item) => {
                          const change = item.after - item.before
                          const changePercent = ((change / item.before) * 100).toFixed(1)
                          return (
                            <tr key={item.metric} className="border-b border-border/50">
                              <td className="p-2 font-medium">{item.metric}</td>
                              <td className="p-2 text-center">
                                {item.before}
                                {item.unit}
                              </td>
                              <td className="p-2 text-center">
                                {item.after}
                                {item.unit}
                              </td>
                              <td className={cn("p-2 text-center font-medium", getImpactColor(change))}>
                                {change > 0 ? "+" : ""}
                                {change.toFixed(1)}
                                {item.unit} ({changePercent}%)
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedResult.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm">{recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
