import { NextRequest, NextResponse } from 'next/server'

const POSTHOG_HOST = 'https://us.i.posthog.com'

// Proxy all PostHog requests to bypass ad blockers
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const url = new URL(request.url)
    
    // Forward the request to PostHog
    const posthogUrl = `${POSTHOG_HOST}${url.pathname.replace('/api/analytics', '')}`
    
    const response = await fetch(posthogUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'Kinddy-Analytics-Proxy/1.0',
      },
      body: body,
    })

    const responseData = await response.text()
    
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Analytics proxy error:', error)
    return NextResponse.json(
      { error: 'Analytics proxy failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const posthogUrl = `${POSTHOG_HOST}${url.pathname.replace('/api/analytics', '')}${url.search}`
    
    const response = await fetch(posthogUrl, {
      method: 'GET',
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Kinddy-Analytics-Proxy/1.0',
      },
    })

    const responseData = await response.text()
    
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Analytics proxy error:', error)
    return NextResponse.json(
      { error: 'Analytics proxy failed' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
