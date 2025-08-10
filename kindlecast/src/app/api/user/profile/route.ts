import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase, UserService, ConfigService } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDatabase()
    const userService = new UserService(db)
    const configService = new ConfigService(db)
    
    let userProfile = await userService.getUserProfile(session.user.id)

    // If user doesn't exist by userId, check by email to prevent duplicates
    if (!userProfile) {
      userProfile = await userService.getUserProfileByEmail(session.user.email!)

      // If found by email, update the userId to match current session
      if (userProfile) {
        await userService.updateUserProfile(userProfile.userId, {
          userId: session.user.id
        })
        userProfile.userId = session.user.id
      } else {
        // Create new user profile
        userProfile = await userService.createUserProfile({
          userId: session.user.id,
          email: session.user.email!,
          name: session.user.name!,
          avatar: session.user.image
        })
      }
    }
    
    // Get app config for trial calculations
    const config = await configService.getConfig()
    
    // Calculate trial days remaining
    let trialDaysRemaining = 0
    if (!userProfile.user_subscribed && userProfile.trial_started) {
      const trialEndDate = new Date(userProfile.trial_started)
      trialEndDate.setDate(trialEndDate.getDate() + config.free_trial_days)
      const now = new Date()
      const diffTime = trialEndDate.getTime() - now.getTime()
      trialDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    }
    
    return NextResponse.json({
      ...userProfile,
      trialDaysRemaining,
      config: {
        free_trial_days: config.free_trial_days,
        basic_conversions_limit: config.basic_conversions_limit,
        ai_conversions_limit: config.ai_conversions_limit
      }
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const db = await getDatabase()
    const userService = new UserService(db)
    
    await userService.updateUserProfile(session.user.id, updates)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
