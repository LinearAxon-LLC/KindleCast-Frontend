import { NextRequest, NextResponse } from 'next/server'
import { PostHog } from 'posthog-node'

// Server-side PostHog client
const posthog = new PostHog('phc_DFvx3polM4OK4KVRm7tkezLzJvdf3dxrOQ0q5iuWfr4', {
  host: 'https://us.i.posthog.com',
})

export async function POST(request: NextRequest) {
  try {
    const { event, properties, distinct_id } = await request.json()

    if (!event || !distinct_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event, distinct_id' },
        { status: 400 }
      )
    }

    // Get client information from headers
    const clientInfo = {
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || '',
      timestamp: new Date().toISOString(),
      server_tracked: true,
    }

    // Merge properties with client info
    const eventProperties = {
      ...properties,
      ...clientInfo,
      $ip: clientInfo.ip,
      $useragent: clientInfo.user_agent,
      $referrer: clientInfo.referer,
    }

    // Track the event
    posthog.capture({
      distinctId: distinct_id,
      event: event,
      properties: eventProperties,
    })

    // Ensure the event is sent
    await posthog.flush()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server-side tracking error:', error)
    return NextResponse.json(
      { error: 'Server-side tracking failed' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
