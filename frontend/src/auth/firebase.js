import firebase from 'firebase/compat/app'
import config from '../config'
import 'firebase/compat/auth'

try {
  firebase.initializeApp(config.firebaseConfig)
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

export default firebase
