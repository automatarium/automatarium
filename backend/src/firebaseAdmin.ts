import admin from 'firebase-admin'

import config from './config'

// Initialise firebase connection
if (process.env.NODE_ENV === 'production') {
  admin.initializeApp()
} else {
  admin.initializeApp({
    credential: admin.credential.cert(require(config.firebaseAccountPath || "")),
  })
}

export default admin