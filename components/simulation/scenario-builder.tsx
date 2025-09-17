"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { FlaskConical, Plus, X, Save, Play, RotateCcw } from "lucide-react"

interface ScenarioParameter {
  id: string
  type: "train_delay" | "route_change" | "weather" | "maintenance" | "capacity"
  name: string
  value: string | number
  description: string
}

interface Scenario {
  id: string
  name: string
  description: string
  parameters: ScenarioParameter[]
  status: "draft" | "running" | "completed"
  createdAt: string
}

const parameterTypes = [
  { value: "train_delay", label: "Train Delay", description: "Simulate train delays" },
  { value: "route_change", label: "Route Change", description: "Test alternative routing" },
  { value: "weather", label: "Weather Impact", description: "Weather-related disruptions" },
  { value: "maintenance", label: "Maintenance", description: "Scheduled maintenance impact" },
  { value: "capacity", label: "Capacity Change", description: "Track capacity modifications" },
]

export function ScenarioBuilder() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [isBuilding, setIsBuilding] = useState(false)
  const [newParameter, setNewParameter] = useState<Partial<ScenarioParameter>>({})

  const startNewScenario = () => {
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: "",
      description: "",
      parameters: [],
      status: "draft",
      createdAt: new Date().toISOString(),
    }
    setCurrentScenario(newScenario)
    setIsBuilding(true)
  }

  const addParameter = () => {
    if (!currentScenario || !newParameter.type || !newParameter.name || !newParameter.value) return

    const parameter: ScenarioParameter = {
      id: Date.now().toString(),
      type: newParameter.type as ScenarioParameter["type"],
      name: newParameter.name,
      value: newParameter.value,
      description: newParameter.description || "",
    }

    setCurrentScenario({
      ...currentScenario,
      parameters: [...currentScenario.parameters, parameter],
    })

    setNewParameter({})
  }

  const removeParameter = (parameterId: string) => {
    if (!currentScenario) return

    setCurrentScenario({
      ...currentScenario,
      parameters: currentScenario.parameters.filter((p) => p.id !== parameterId),
    })
  }

  const saveScenario = () => {
    if (!currentScenario || !currentScenario.name) return

    setScenarios([...scenarios, currentScenario])
    setCurrentScenario(null)
    setIsBuilding(false)
  }

  const runScenario = (scenarioId: string) => {
    setScenarios(scenarios.map((s) => (s.id === scenarioId ? { ...s, status: "running" as const } : s)))

    // Simulate scenario completion after 3 seconds
    setTimeout(() => {
      setScenarios((prev) => prev.map((s) => (s.id === scenarioId ? { ...s, status: "completed" as const } : s)))
    }, 3000)
  }

  const getParameterTypeInfo = (type: string) => {
    return parameterTypes.find((pt) => pt.value === type)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scenario Builder</h2>
          <p className="text-muted-foreground">Create and test what-if scenarios for railway operations</p>
        </div>
        <Button onClick={startNewScenario} disabled={isBuilding}>
          <Plus className="w-4 h-4 mr-2" />
          New Scenario
        </Button>
      </div>

      {/* Scenario Builder Form */}
      <AnimatePresence>
        {isBuilding && currentScenario && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  Build New Scenario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scenario-name">Scenario Name</Label>
                    <Input
                      id="scenario-name"
                      placeholder="e.g., Heavy Rain Impact Test"
                      value={currentScenario.name}
                      onChange={(e) => setCurrentScenario({ ...currentScenario, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scenario-description">Description</Label>
                    <Textarea
                      id="scenario-description"
                      placeholder="Describe the scenario..."
                      value={currentScenario.description}
                      onChange={(e) => setCurrentScenario({ ...currentScenario, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Add Parameter */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Add Parameter</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={newParameter.type || ""}
                        onValueChange={(value) =>
                          setNewParameter({ ...newParameter, type: value as ScenarioParameter["type"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {parameterTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        placeholder="Parameter name"
                        value={newParameter.name || ""}
                        onChange={(e) => setNewParameter({ ...newParameter, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        placeholder="Value"
                        value={newParameter.value || ""}
                        onChange={(e) => setNewParameter({ ...newParameter, value: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button onClick={addParameter} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Current Parameters */}
                {currentScenario.parameters.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Scenario Parameters</h4>
                    <div className="space-y-2">
                      {currentScenario.parameters.map((param) => {
                        const typeInfo = getParameterTypeInfo(param.type)
                        return (
                          <motion.div
                            key={param.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">{typeInfo?.label}</Badge>
                              <div>
                                <div className="font-medium text-sm">{param.name}</div>
                                <div className="text-xs text-muted-foreground">Value: {param.value}</div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeParameter(param.id)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={saveScenario} disabled={!currentScenario.name}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Scenario
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentScenario(null)
                      setIsBuilding(false)
                      setNewParameter({})
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Scenarios */}
      {scenarios.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Saved Scenarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{scenario.name}</h4>
                      <Badge
                        className={
                          scenario.status === "draft"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                            : scenario.status === "running"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        }
                      >
                        {scenario.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    <div className="text-xs text-muted-foreground">{scenario.parameters.length} parameters</div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => runScenario(scenario.id)}
                        disabled={scenario.status === "running"}
                        className="flex-1"
                      >
                        {scenario.status === "running" ? (
                          <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        {scenario.status === "running" ? "Running..." : "Run"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {scenarios.length === 0 && !isBuilding && (
        <Card>
          <CardContent className="p-12 text-center">
            <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No scenarios created yet</h3>
            <p className="text-muted-foreground mb-4">Create your first scenario to start testing what-if situations</p>
            <Button onClick={startNewScenario}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Scenario
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
