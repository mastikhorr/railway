"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  Route,
  Users,
  Zap,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

interface RecommendationCardProps {
  recommendation: Recommendation
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onViewDetails: (recommendation: Recommendation) => void
}

const priorityColors = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
}

const categoryIcons = {
  routing: Route,
  scheduling: Clock,
  maintenance: AlertTriangle,
  resource: Users,
  safety: Zap,
}

const categoryColors = {
  routing: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  scheduling: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  maintenance: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  resource: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  safety: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
}

export function RecommendationCard({ recommendation, onAccept, onReject, onViewDetails }: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const CategoryIcon = categoryIcons[recommendation.category]

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 dark:text-green-400"
    if (confidence >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const formatImpact = (value: number, suffix: string) => {
    return value > 0 ? `+${value}${suffix}` : `${value}${suffix}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Card className="border-border/50 hover:border-border transition-all duration-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CategoryIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{recommendation.title}</h3>
                    <Badge className={cn("text-xs", priorityColors[recommendation.priority])}>
                      {recommendation.priority}
                    </Badge>
                    <Badge className={cn("text-xs", categoryColors[recommendation.category])}>
                      {recommendation.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Confidence</div>
                <div className={cn("text-lg font-bold", getConfidenceColor(recommendation.confidence))}>
                  {recommendation.confidence}%
                </div>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground">Time Saved</div>
                <div className="font-semibold text-green-600 dark:text-green-400">
                  {formatImpact(recommendation.estimatedImpact.timeReduction, " min")}
                </div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground">Cost Impact</div>
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {formatImpact(recommendation.estimatedImpact.costSaving, "K")}
                </div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground">Efficiency</div>
                <div className="font-semibold text-purple-600 dark:text-purple-400">
                  {formatImpact(recommendation.estimatedImpact.efficiencyGain, "%")}
                </div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground">Risk Reduction</div>
                <div className="font-semibold text-orange-600 dark:text-orange-400">
                  {formatImpact(recommendation.estimatedImpact.riskReduction, "%")}
                </div>
              </div>
            </div>

            {/* Affected Entities */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Affected:</div>
              <div className="flex flex-wrap gap-1">
                {recommendation.affectedEntities.trains.map((train) => (
                  <Badge key={train} variant="outline" className="text-xs">
                    Train {train}
                  </Badge>
                ))}
                {recommendation.affectedEntities.stations.map((station) => (
                  <Badge key={station} variant="outline" className="text-xs">
                    {station}
                  </Badge>
                ))}
                {recommendation.affectedEntities.routes.map((route) => (
                  <Badge key={route} variant="outline" className="text-xs">
                    Route {route}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Expandable Details */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Hide details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Show details
                  </>
                )}
              </Button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-3 border-t border-border/50"
                  >
                    {/* Reasoning */}
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">AI Analysis</div>
                      <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
                        {recommendation.reasoning.analysis}
                      </p>
                    </div>

                    {/* Key Data Points */}
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">Key Data Points</div>
                      <ul className="space-y-1">
                        {recommendation.reasoning.dataPoints.map((point, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                            <Target className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Implementation Steps */}
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">Implementation</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Duration: {recommendation.implementation.duration}</span>
                          <span>Resources: {recommendation.implementation.resources.join(", ")}</span>
                        </div>
                        <ol className="space-y-1">
                          {recommendation.implementation.steps.map((step, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="w-4 h-4 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => onAccept(recommendation.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={recommendation.status !== "pending"}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(recommendation.id)}
                className="flex-1"
                disabled={recommendation.status !== "pending"}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(recommendation)} className="px-3">
                <Brain className="w-4 h-4" />
              </Button>
            </div>

            {/* Status */}
            {recommendation.status !== "pending" && (
              <div className="text-center">
                <Badge
                  className={cn(
                    "text-xs",
                    recommendation.status === "accepted" &&
                      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                    recommendation.status === "rejected" &&
                      "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                    recommendation.status === "implemented" &&
                      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                  )}
                >
                  {recommendation.status}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
