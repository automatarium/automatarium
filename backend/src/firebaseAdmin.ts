import admin from 'firebase-admin'
import { existsSync } from 'fs'

import config from './config'

// Config must be set
if (!config.firebaseAccountPath) {
  throw Error('❌ Firebase account config path must be set')
}

// Check for firebase account existence
if (!existsSync(config.firebaseAccountPath)) {
  throw Error(`❌ Can't find firebase account config at "${config.firebaseAccountPath}"`)
}

// Initialise firebase connection
if (process.env.NODE_ENV === 'production') {
  admin.initializeApp()
} else {
  admin.initializeApp({
    credential: admin.credential.cert(require(config.firebaseAccountPath)),
  })
}

console.log('🔥 Initialized firebase')

export default admin
