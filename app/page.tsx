import { DashboardHeader } from "@/components/dashboard-header"
import { SensorOverview } from "@/components/sensor-overview"
import { SensorCharts } from "@/components/sensor-charts"
import { PumpControls } from "@/components/pump-controls"
import { SystemStatus } from "@/components/system-status"

export default function AgriculturalDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* System Status Overview */}
        <SystemStatus />

        {/* Sensor Overview Cards */}
        <SensorOverview />

        {/* Charts Section */}
        <SensorCharts />

        {/* Pump Controls */}
        <PumpControls />
      </main>
    </div>
  )
}
