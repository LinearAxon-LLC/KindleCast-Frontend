import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase, UserService } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { kindleEmail, confirmed } = await request.json()
    
    if (!kindleEmail || !confirmed) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await getDatabase()
    const userService = new UserService(db)
    
    // Generate unique KTool email for this user
    const ktoolEmail = `${session.user.id.slice(-8)}@ktool.kindlecast.app`
    
    await userService.setupDevice(session.user.id, kindleEmail, ktoolEmail)
    
    return NextResponse.json({ 
      success: true,
      ktoolEmail,
      message: 'Device setup completed successfully'
    })
  } catch (error) {
    console.error('Error setting up device:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
