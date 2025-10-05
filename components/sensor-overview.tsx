"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplets, Sprout, Zap } from "lucide-react"
import { useState, useEffect } from "react"

interface SensorData {
  temperature: number
  humidity: number
  soilMoisture: number
  pumpStatus: boolean
}

export function SensorOverview() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
    pumpStatus: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
   const fetchLatestData = async () => {
      try {
        const response = await fetch('https://agricultural-backend.onrender.com/latest');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Ánh xạ dữ liệu từ API sang định dạng SensorData
        setSensorData((prev) => ({
          temperature: data.temperature || prev.temperature,
          humidity: data.humidity || prev.humidity,
          soilMoisture: data.soil || prev.soilMoisture,
          pumpStatus: (data.soil || prev.soilMoisture) < 30 ? true : (data.soil || prev.soilMoisture) > 60 ? false : prev.pumpStatus,
        }));
        setIsLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
        setIsLoading(false);
      }
    }

    // Initial simulation
    fetchLatestData();

    // Update every 5 seconds with simulated data
    const interval = setInterval(fetchLatestData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Air Temperature",
      value: `${sensorData.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      description: "DHT22 Sensor",
      status: sensorData.temperature > 30 ? "High" : sensorData.temperature < 15 ? "Low" : "Normal",
    },
    {
      title: "Air Humidity",
      value: `${sensorData.humidity.toFixed(0)}%`,
      icon: Droplets,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      description: "DHT22 Sensor",
      status: sensorData.humidity > 70 ? "High" : sensorData.humidity < 40 ? "Low" : "Optimal",
    },
    {
      title: "Soil Moisture",
      value: `${sensorData.soilMoisture.toFixed(0)}%`,
      icon: Sprout,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      description: "LM393 Sensor",
      status: sensorData.soilMoisture > 60 ? "Wet" : sensorData.soilMoisture < 30 ? "Dry" : "Good",
    },
    {
      title: "Water Pump",
      value: sensorData.pumpStatus ? "Active" : "Idle",
      icon: Zap,
      color: sensorData.pumpStatus ? "text-primary" : "text-muted-foreground",
      bgColor: sensorData.pumpStatus ? "bg-primary/10" : "bg-muted/10",
      description: "Irrigation System",
      status: sensorData.pumpStatus ? "Running" : "Standby",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{card.description}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    card.status === "High" || card.status === "Dry"
                      ? "bg-destructive/10 text-destructive"
                      : card.status === "Running" || card.status === "Optimal" || card.status === "Good"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/10 text-muted-foreground"
                  }`}
                >
                  {card.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
