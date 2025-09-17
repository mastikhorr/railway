"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const performanceData = [
  { time: "00:00", punctuality: 92, throughput: 45 },
  { time: "04:00", punctuality: 89, throughput: 38 },
  { time: "08:00", punctuality: 85, throughput: 62 },
  { time: "12:00", punctuality: 78, throughput: 75 },
  { time: "16:00", punctuality: 82, throughput: 68 },
  { time: "20:00", punctuality: 88, throughput: 52 },
  { time: "24:00", punctuality: 91, throughput: 41 },
]

export function PerformanceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>24-Hour Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="punctuality"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Punctuality %"
                />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Throughput (trains/hr)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
