import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Perform any necessary health checks here
    // For now, just return OK status
    return NextResponse.json(
      { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        framework: 'nextjs'
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    )
  }
}