import dotenv from 'dotenv'

// Init config
dotenv.config()

// Determine env
const env = process.env.NODE_ENV || 'production'
console.log('Using config for environment: ', env)

// DB connection params
const dbUsername = process.env.DB_USERNAME || 'superuser'
const dbPassword = process.env.DB_PASSWORD || 'passw0rd'
const dbHostname = process.env.DB_HOST || 'localhost'

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

// Server Config
const serverHostname = process.env.SERVER_HOSTNAME || 'localhost'
const serverPort = process.env.PORT || 3001

// Server config object
const server = {
  hostname: serverHostname,
  port: serverPort
}

const config = {
  db: db,
  server: server
}

export default config