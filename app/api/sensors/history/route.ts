import { NextResponse } from 'next/server'

const FASTAPI_URL = 'https://agricultural-backend.onrender.com'

export async function GET() {
  try {
    const response = await fetch(`${FASTAPI_URL}/data?limit=100`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.status}`)
    }

    const result = await response.json()
    console.log('API Response:', result) // Debug log

    const chartData = result.records.map((record: any[]) => {
      const timestamp = new Date(record[0]) // "Timestamp"
      return {
        time: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: parseFloat(record[1]) || 0, // "Temperature (°C)"
        humidity: parseFloat(record[2]) || 0,    // "Humidity (%)"
        soilMoisture: parseFloat(record[3]) || 0, // "Soil Humidity (%)"
      }
    })
    
    console.log('Processed Chart Data:', chartData) // Debug log
    return NextResponse.json({
      success: true,
      data: chartData.slice(-24),
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success: false,
      data: [],
    })
  }
}