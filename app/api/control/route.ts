// app/api/control/route.ts
import { NextResponse } from 'next/server'

const FASTAPI_URL = 'http://192.168.34.100:8080' // ← Port 8080!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('📤 Sending to FastAPI:', body) // Debug log
    
    // Validate input - CHỈ CHECK RANGE, KHÔNG CHECK low < high
    if (body.low_threshold < 0 || body.high_threshold > 100) {
      return NextResponse.json(
        { success: false, error: 'Thresholds must be between 0-100' },
        { status: 400 }
      )
    }

    const response = await fetch(`${FASTAPI_URL}/control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log('📥 Response from FastAPI:', data) // Debug log

    if (!response.ok) {
      console.error('❌ FastAPI error:', response.status, data)
      return NextResponse.json(
        { success: false, error: data.detail || 'FastAPI error' },
        { status: response.status }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error('❌ Error updating control:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update control settings',
      },
      { status: 500 }
    )
  }
}