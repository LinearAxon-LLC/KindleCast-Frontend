import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(process.env.MONGODB_DB || 'kindlecast')
}

// User onboarding and tracking interfaces
export interface UserProfile {
  _id?: string
  userId: string
  email: string
  name: string
  avatar?: string
  
  // Onboarding tracking
  signed_up: boolean
  when_signed_up: Date
  user_subscribed: boolean
  trial_started?: Date
  set_up_device: boolean
  
  // Device setup
  kindle_email?: string
  ktool_email?: string
  device_setup_completed?: boolean
  
  // Usage tracking
  basic_conversions: number
  ai_conversions: number
  
  // Timestamps
  created_at: Date
  updated_at: Date
}

export interface AppConfig {
  _id?: string
  free_trial_days: number
  basic_conversions_limit: number
  ai_conversions_limit: number
  paid_plans: {
    monthly: {
      price: number
      basic_conversions: number
      ai_conversions: number
    }
  }
  created_at: Date
  updated_at: Date
}

// Database operations
export class UserService {
  private db: Db

  constructor(db: Db) {
    this.db = db
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const collection = this.db.collection<UserProfile>('users')
    return await collection.findOne({ userId })
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
    const collection = this.db.collection<UserProfile>('users')
    return await collection.findOne({ email })
  }

  async createUserProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    const collection = this.db.collection<UserProfile>('users')
    
    const userProfile: UserProfile = {
      userId: userData.userId!,
      email: userData.email!,
      name: userData.name!,
      avatar: userData.avatar,
      
      // Default onboarding state
      signed_up: true,
      when_signed_up: new Date(),
      user_subscribed: false,
      trial_started: new Date(),
      set_up_device: false,
      
      // Default usage
      basic_conversions: 0,
      ai_conversions: 0,
      
      // Timestamps
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await collection.insertOne(userProfile)
    return { ...userProfile, _id: result.insertedId.toString() }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const collection = this.db.collection<UserProfile>('users')
    await collection.updateOne(
      { userId },
      { 
        $set: { 
          ...updates, 
          updated_at: new Date() 
        } 
      }
    )
  }

  async setupDevice(userId: string, kindleEmail: string, ktoolEmail: string): Promise<void> {
    await this.updateUserProfile(userId, {
      kindle_email: kindleEmail,
      ktool_email: ktoolEmail,
      set_up_device: true,
      device_setup_completed: true
    })
  }
}

export class ConfigService {
  private db: Db

  constructor(db: Db) {
    this.db = db
  }

  async getConfig(): Promise<AppConfig> {
    const collection = this.db.collection<AppConfig>('config')
    let config = await collection.findOne({})
    
    if (!config) {
      // Create default config
      const defaultConfig: AppConfig = {
        free_trial_days: 7,
        basic_conversions_limit: 5,
        ai_conversions_limit: 3,
        paid_plans: {
          monthly: {
            price: 9,
            basic_conversions: -1, // unlimited
            ai_conversions: 100
          }
        },
        created_at: new Date(),
        updated_at: new Date()
      }
      
      const result = await collection.insertOne(defaultConfig)
      config = { ...defaultConfig, _id: result.insertedId.toString() }
    }
    
    return config
  }
}

export default clientPromise
