import firebaseConfigDev from './firebase-config-dev.json'

const env = process.env.NODE_ENV || 'development'

const config = {
  development: {
    baseUrl: 'http://localhost:1234',
    API: 'http://localhost:3001',
    documentTitle: '[Dev] Automatarium',
    firebaseConfig: firebaseConfigDev
  },
  production: {
    baseUrl: 'https://automatarium.tdib.xyz',
    API: 'https://api.automatarium.tdib.xyz',
    documentTitle: 'Automatarium',
    firebaseConfig: firebaseConfigDev
  }
}

export * from './colors'
export * from './projects'

export default config[env]
