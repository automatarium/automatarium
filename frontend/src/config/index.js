const env = process.env.NODE_ENV || 'development'

const firebaseConfigDev = require('./firebase-config-dev.json')

const config = {
  development: {
    baseUrl: 'http://localhost:1234',
    API: 'http://localhost:3001',
    documentTitle: '[Dev] Automatarium',
    firebaseConfig: firebaseConfigDev,
  }, production: {
    baseUrl: '',
    API: '',
    documentTitle: '',
    firebaseConfig: {
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    },
  }
}

export default config[env]