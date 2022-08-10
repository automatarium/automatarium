import dotenv from 'dotenv'

// Init config
dotenv.config()

// Determine env
const env = process.env.NODE_ENV || 'production'
console.log(`🔧 Using config for environment: ${env}`)

// DB connection params
const dbUsername = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbHostname = process.env.DB_HOST

// Mongo options
export const mongoOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  autoIndex: false,
  retryWrites: false
}

// Db config object
const db = {
  host: dbHostname,
  userName: dbUsername,
  password: dbPassword,
  options: mongoOptions,
  url: `mongodb+srv://${dbUsername}:${dbPassword}@${dbHostname}`
}

// Server config
const serverHostname = process.env.SERVER_HOSTNAME || 'localhost'
const serverPort = process.env.PORT || 3001

// Server config object
const server = {
  hostname: serverHostname,
  port: serverPort
}

// Firebase configuration
const firebaseAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT

const config = {
  db,
  server,
  firebaseAccountPath
}

export default config
