"use client"

import { useState } from "react"
import { RailwaySidebar } from "@/components/railway-sidebar"
import { RailwayHeader } from "@/components/railway-header"
import { KPICard } from "@/components/dashboard/kpi-card"
import { LiveAlertsPanel } from "@/components/dashboard/live-alerts-panel"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { AIRecommendationsWidget } from "@/components/dashboard/ai-recommendations-widget"
import { InteractiveTrainMap } from "@/components/dashboard/interactive-train-map"
import { TrainTimeline } from "@/components/train-movements/train-timeline"
import { TrainTable } from "@/components/train-movements/train-table"
import { IncidentTimeline } from "@/components/alerts/incident-timeline"
import { AlertsFilters } from "@/components/alerts/alerts-filters"
import { RecommendationsDashboard } from "@/components/ai-recommendations/recommendations-dashboard"
import { ScenarioBuilder } from "@/components/simulation/scenario-builder"
import { SimulationResults } from "@/components/simulation/simulation-results"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { motion } from "framer-motion"
import { Clock, TrendingUp, Train, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RailwayControlSystem() {
  const [activeSection, setActiveSection] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background">
      <RailwaySidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <RailwayHeader />

      <main className="ml-0 md:ml-80 pt-16 p-6">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Railway Traffic Control Dashboard</h1>
                <p className="text-muted-foreground">Real-time operations overview and decision support</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  title="Average Delay"
                  value="12.5 min"
                  change="-2.3 min from yesterday"
                  changeType="positive"
                  icon={Clock}
                />
                <KPICard
                  title="Punctuality"
                  value="87.2%"
                  change="+3.1% from yesterday"
                  changeType="positive"
                  icon={TrendingUp}
                />
                <KPICard
                  title="Throughput"
                  value="64 trains/hr"
                  change="+8 trains from avg"
                  changeType="positive"
                  icon={Train}
                />
                <KPICard
                  title="System Utilization"
                  value="78.9%"
                  change="Normal range"
                  changeType="neutral"
                  icon={Zap}
                />
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Chart - spans 2 columns */}
                <div className="lg:col-span-2">
                  <PerformanceChart />
                </div>

                {/* Live Alerts Panel */}
                <div className="lg:col-span-1">
                  <LiveAlertsPanel />
                </div>
              </div>

              {/* AI Recommendations and Train Map */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIRecommendationsWidget />
                <InteractiveTrainMap />
              </div>
            </div>
          )}

          {activeSection === "movements" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Train Movements</h1>
                <p className="text-muted-foreground">Real-time train tracking and schedule monitoring</p>
              </div>

              <TrainTimeline />
              <TrainTable />
            </div>
          )}

          {activeSection === "alerts" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Alerts & Incidents</h1>
                <p className="text-muted-foreground">Monitor and manage railway incidents and alerts</p>
              </div>

              <AlertsFilters onFiltersChange={() => {}} />
              <IncidentTimeline />
            </div>
          )}

          {activeSection === "ai-recommendations" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">AI Recommendations</h1>
                <p className="text-muted-foreground">
                  Intelligent decision support powered by machine learning and predictive analytics
                </p>
              </div>

              <RecommendationsDashboard />
            </div>
          )}

          {activeSection === "simulation" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Simulation Mode</h1>
                <p className="text-muted-foreground">
                  Test what-if scenarios and analyze potential impacts on railway operations
                </p>
              </div>

              <Tabs defaultValue="builder" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="builder">Scenario Builder</TabsTrigger>
                  <TabsTrigger value="results">Results & Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="builder">
                  <ScenarioBuilder />
                </TabsContent>

                <TabsContent value="results">
                  <SimulationResults />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="space-y-6">
              <SettingsPanel />
            </div>
          )}

          {activeSection !== "dashboard" &&
            activeSection !== "movements" &&
            activeSection !== "alerts" &&
            activeSection !== "ai-recommendations" &&
            activeSection !== "simulation" &&
            activeSection !== "settings" && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4 capitalize">{activeSection.replace("-", " ")}</h2>
                <p className="text-muted-foreground">This section has been implemented above</p>
              </div>
            )}
        </motion.div>
      </main>
    </div>
  )
}
