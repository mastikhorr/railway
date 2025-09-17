"use client"

import { useState } from "react"
import { Bell, Monitor, Shield, Database, Gauge, Save, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    // Display Settings
    theme: "system",
    mapRefreshRate: [30],
    showTrainNumbers: true,
    showDelayIndicators: true,
    compactView: false,

    // Notification Settings
    soundAlerts: true,
    criticalAlerts: true,
    delayNotifications: true,
    systemNotifications: true,
    alertVolume: [75],

    // Operational Settings
    autoRefresh: true,
    refreshInterval: [60],
    defaultTimeRange: "24h",
    stationFilter: "all",
    trainTypeFilter: "all",

    // Security Settings
    sessionTimeout: [30],
    requireReauth: true,
    auditLogging: true,

    // Performance Settings
    maxTrainsDisplay: [500],
    cacheEnabled: true,
    preloadData: true,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetToDefaults = () => {
    // Reset logic here
    console.log("[v0] Resetting settings to defaults")
  }

  const saveSettings = () => {
    // Save logic here
    console.log("[v0] Saving settings:", settings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
          <p className="text-muted-foreground">Configure your railway traffic control system preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults} className="gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </Button>
          <Button onClick={saveSettings} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Display Settings
            </CardTitle>
            <CardDescription>Customize the appearance and layout of your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme Preference</Label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="system">System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Map Refresh Rate (seconds)</Label>
              <Slider
                value={settings.mapRefreshRate}
                onValueChange={(value) => updateSetting("mapRefreshRate", value)}
                max={120}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">{settings.mapRefreshRate[0]} seconds</div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Train Numbers</Label>
              <Switch
                checked={settings.showTrainNumbers}
                onCheckedChange={(checked) => updateSetting("showTrainNumbers", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Delay Indicators</Label>
              <Switch
                checked={settings.showDelayIndicators}
                onCheckedChange={(checked) => updateSetting("showDelayIndicators", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Compact View Mode</Label>
              <Switch
                checked={settings.compactView}
                onCheckedChange={(checked) => updateSetting("compactView", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure alerts and notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Sound Alerts</Label>
              <Switch
                checked={settings.soundAlerts}
                onCheckedChange={(checked) => updateSetting("soundAlerts", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Alert Volume</Label>
              <Slider
                value={settings.alertVolume}
                onValueChange={(value) => updateSetting("alertVolume", value)}
                max={100}
                min={0}
                step={5}
                className="w-full"
                disabled={!settings.soundAlerts}
              />
              <div className="text-sm text-muted-foreground">{settings.alertVolume[0]}%</div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Critical Alerts</Label>
                <p className="text-sm text-muted-foreground">Signal failures, accidents</p>
              </div>
              <Switch
                checked={settings.criticalAlerts}
                onCheckedChange={(checked) => updateSetting("criticalAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Delay Notifications</Label>
                <p className="text-sm text-muted-foreground">Train delays &gt;15 minutes</p>
              </div>
              <Switch
                checked={settings.delayNotifications}
                onCheckedChange={(checked) => updateSetting("delayNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>System Notifications</Label>
                <p className="text-sm text-muted-foreground">Updates and maintenance</p>
              </div>
              <Switch
                checked={settings.systemNotifications}
                onCheckedChange={(checked) => updateSetting("systemNotifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Operational Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Operational Settings
            </CardTitle>
            <CardDescription>Configure system behavior and data preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto Refresh Data</Label>
              <Switch
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => updateSetting("autoRefresh", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Refresh Interval (seconds)</Label>
              <Slider
                value={settings.refreshInterval}
                onValueChange={(value) => updateSetting("refreshInterval", value)}
                max={300}
                min={30}
                step={30}
                className="w-full"
                disabled={!settings.autoRefresh}
              />
              <div className="text-sm text-muted-foreground">{settings.refreshInterval[0]} seconds</div>
            </div>

            <div className="space-y-2">
              <Label>Default Time Range</Label>
              <Select
                value={settings.defaultTimeRange}
                onValueChange={(value) => updateSetting("defaultTimeRange", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last 1 Hour</SelectItem>
                  <SelectItem value="6h">Last 6 Hours</SelectItem>
                  <SelectItem value="12h">Last 12 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Station Filter</Label>
              <Select value={settings.stationFilter} onValueChange={(value) => updateSetting("stationFilter", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stations</SelectItem>
                  <SelectItem value="major">Major Stations Only</SelectItem>
                  <SelectItem value="junction">Junction Stations</SelectItem>
                  <SelectItem value="terminal">Terminal Stations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Train Type Filter</Label>
              <Select
                value={settings.trainTypeFilter}
                onValueChange={(value) => updateSetting("trainTypeFilter", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Train Types</SelectItem>
                  <SelectItem value="passenger">Passenger Only</SelectItem>
                  <SelectItem value="express">Express Only</SelectItem>
                  <SelectItem value="freight">Freight Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security & Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Performance
            </CardTitle>
            <CardDescription>System security and performance optimization settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Slider
                value={settings.sessionTimeout}
                onValueChange={(value) => updateSetting("sessionTimeout", value)}
                max={120}
                min={15}
                step={15}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">{settings.sessionTimeout[0]} minutes</div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Require Re-authentication</Label>
                <p className="text-sm text-muted-foreground">For critical operations</p>
              </div>
              <Switch
                checked={settings.requireReauth}
                onCheckedChange={(checked) => updateSetting("requireReauth", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Track all user actions</p>
              </div>
              <Switch
                checked={settings.auditLogging}
                onCheckedChange={(checked) => updateSetting("auditLogging", checked)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Maximum Trains to Display</Label>
              <Slider
                value={settings.maxTrainsDisplay}
                onValueChange={(value) => updateSetting("maxTrainsDisplay", value)}
                max={1000}
                min={100}
                step={100}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">{settings.maxTrainsDisplay[0]} trains</div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Data Caching</Label>
                <p className="text-sm text-muted-foreground">Improve performance</p>
              </div>
              <Switch
                checked={settings.cacheEnabled}
                onCheckedChange={(checked) => updateSetting("cacheEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Preload Historical Data</Label>
                <p className="text-sm text-muted-foreground">Faster chart loading</p>
              </div>
              <Switch
                checked={settings.preloadData}
                onCheckedChange={(checked) => updateSetting("preloadData", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">99.8%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1,247</div>
              <div className="text-sm text-muted-foreground">Active Trains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-muted-foreground">Connected Stations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">23ms</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
