"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Droplets, Play, Square, Settings2 } from "lucide-react"
import { useState, useEffect } from "react"

interface PumpState {
  status: boolean
  mode: "manual" | "automatic"
  threshold: number
  lastActivated: string | null
}

export function PumpControls() {
  const [pumpState, setPumpState] = useState<PumpState>({
    status: false,
    mode: "automatic",
    threshold: 30,
    lastActivated: null,
  })
  const [highThreshold, setHighThreshold] = useState([60])
  const [currentMoisture, setCurrentMoisture] = useState(45)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch latest sensor data and control status
  useEffect(() => {
    const fetchData = async () => {
      try {
        const latestResponse = await fetch("https://agricultural-backend.onrender.com/latest")
        if (!latestResponse.ok) throw new Error("Failed to fetch latest data")
        const latestData = await latestResponse.json()
        console.log("Latest data:", latestData)
        setCurrentMoisture(latestData.soil || 45)
        setPumpState((prev) => ({ ...prev, status: latestData.pump_status || false }))

        const statusResponse = await fetch("https://agricultural-backend.onrender.com/status")
        if (!statusResponse.ok) throw new Error("Failed to fetch status")
        const statusData = await statusResponse.json()
        console.log("Status data:", statusData)
        setPumpState((prev) => ({
          ...prev,
          mode: statusData.mode || "automatic",
          threshold: statusData.low_threshold || 30,
        }))
        setHighThreshold([statusData.high_threshold || 60])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData() // Initial fetch

    // Poll every 5 seconds
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  // Handle mode toggle (send to /control)
  const handleModeToggle = async (autoMode: boolean) => {
    const newMode = autoMode ? "automatic" : "manual"
    try {
      const response = await fetch("https://agricultural-backend.onrender.com/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: newMode,
          low_threshold: pumpState.threshold,
          high_threshold: highThreshold[0],
          pump_status: pumpState.status, // Giữ trạng thái hiện tại
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error (mode):", errorData)
        throw new Error(errorData.detail || "Failed to update mode")
      }
      const result = await response.json()
      console.log("Mode update response:", result)
      setPumpState((prev) => ({
        ...prev,
        mode: newMode,
      }))
    } catch (error) {
      console.error("Error updating mode:", error)
      alert("Failed to update mode. Check console for details.")
    }
  }

  // Handle manual pump toggle (send to /control)
  const handleManualToggle = async () => {
    if (pumpState.mode !== "manual") return

    const newStatus = !pumpState.status
    try {
      const response = await fetch("https://agricultural-backend.onrender.com/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: pumpState.mode,
          low_threshold: pumpState.threshold,
          high_threshold: highThreshold[0],
          pump_status: newStatus,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error (pump):", errorData)
        throw new Error(errorData.detail || "Failed to update pump status")
      }
      const result = await response.json()
      console.log("Pump toggle response:", result)
      setPumpState((prev) => ({
        ...prev,
        status: newStatus,
        lastActivated: newStatus ? new Date().toISOString() : prev.lastActivated,
      }))
    } catch (error) {
      console.error("Error updating pump status:", error)
      alert("Failed to toggle pump. Check console for details.")
    }
  }

  // Handle threshold change (send to /control)
  const handleThresholdChange = async (threshold: number) => {
    try {
      const response = await fetch("https://agricultural-backend.onrender.com/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: pumpState.mode,
          low_threshold: threshold,
          high_threshold: highThreshold[0],
          pump_status: pumpState.status,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error:", errorData)
        throw new Error(errorData.detail || "Failed to update threshold")
      }
      setPumpState((prev) => ({ ...prev, threshold }))
    } catch (error) {
      console.error("Error updating threshold:", error)
    }
  }

  // Handle high threshold change (send to /control)
  const handleHighThresholdChange = async (value: number[]) => {
    const newHighThreshold = value[0]
    try {
      const response = await fetch("https://agricultural-backend.onrender.com/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: pumpState.mode,
          low_threshold: pumpState.threshold,
          high_threshold: newHighThreshold,
          pump_status: pumpState.status,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error:", errorData)
        throw new Error(errorData.detail || "Failed to update high threshold")
      }
      setHighThreshold(value)
    } catch (error) {
      console.error("Error updating high threshold:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" />
            Irrigation Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Automatic Mode</p>
              <p className="text-sm text-muted-foreground">Pump activates based on soil moisture thresholds</p>
            </div>
            <Switch checked={pumpState.mode === "automatic"} onCheckedChange={handleModeToggle} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Status</span>
              <Badge variant={pumpState.status ? "default" : "secondary"}>
                {pumpState.status ? "Running" : "Idle"}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant={pumpState.status ? "destructive" : "default"}
                size="sm"
                onClick={handleManualToggle}
                disabled={pumpState.mode === "automatic"}
                className="flex-1"
              >
                {pumpState.status ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Pump
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Pump
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Settings2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Moisture Thresholds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Low Threshold (Pump ON)</label>
                <span className="text-sm text-muted-foreground">{pumpState.threshold}%</span>
              </div>
              <Slider
                value={[pumpState.threshold]}
                onValueChange={(value) => handleThresholdChange(value[0])}
                max={100}
                min={0}
                step={1}
                className="w-full"
                disabled={pumpState.mode === "manual"}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">High Threshold (Pump OFF)</label>
                <span className="text-sm text-muted-foreground">{highThreshold[0]}%</span>
              </div>
              <Slider
                value={highThreshold}
                onValueChange={handleHighThresholdChange}
                max={100}
                min={0}
                step={1}
                className="w-full"
                disabled={pumpState.mode === "manual"}
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Soil Moisture:</span>
              <span className="font-medium">{currentMoisture.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, currentMoisture))}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Dry ({pumpState.threshold}%)</span>
              <span>Optimal</span>
              <span>Wet ({highThreshold[0]}%)</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>• Pump starts when moisture drops below {pumpState.threshold}%</p>
            <p>• Pump stops when moisture reaches {highThreshold[0]}%</p>
            {pumpState.lastActivated && <p>• Last activated: {new Date(pumpState.lastActivated).toLocaleString()}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}