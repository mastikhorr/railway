"use client"

import { motion } from "framer-motion"
import { Brain, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Recommendation {
  id: string
  title: string
  description: string
  reasoning: string
  priority: "high" | "medium" | "low"
  estimatedImpact: string
  type: "routing" | "scheduling" | "maintenance" | "resource"
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Reroute Train 12345 via Alternative Track",
    description: "Avoid congested main line to reduce delay by 15 minutes",
    reasoning:
      "Current main line has 3 trains queued. Alternative track B-7 is clear with estimated travel time increase of only 5 minutes.",
    priority: "high",
    estimatedImpact: "15 min time saving",
    type: "routing",
  },
  {
    id: "2",
    title: "Adjust Platform Assignment at Mumbai Central",
    description: "Move Express 67890 to Platform 3 for faster turnaround",
    reasoning:
      "Platform 3 has better connectivity to maintenance yard and shorter passenger boarding time based on historical data.",
    priority: "medium",
    estimatedImpact: "8 min turnaround improvement",
    type: "scheduling",
  },
]

const priorityColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
}

export function AIRecommendationsWidget() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleAccept = (id: string) => {
    console.log("Accepted recommendation:", id)
  }

  const handleReject = (id: string) => {
    console.log("Rejected recommendation:", id)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRecommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-foreground">{rec.title}</h4>
                  <Badge className={cn("text-xs", priorityColors[rec.priority])}>{rec.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
                <div className="text-xs text-primary font-medium">Impact: {rec.estimatedImpact}</div>
              </div>
            </div>

            {/* Expandable reasoning */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                className="h-6 p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                {expandedId === rec.id ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Hide reasoning
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Show reasoning
                  </>
                )}
              </Button>

              {expandedId === rec.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md"
                >
                  {rec.reasoning}
                </motion.div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleAccept(rec.id)}
                className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Accept
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleReject(rec.id)} className="h-7 px-3 text-xs">
                <XCircle className="w-3 h-3 mr-1" />
                Reject
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
