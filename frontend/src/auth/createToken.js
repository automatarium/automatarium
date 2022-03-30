import firebase from './fire'

const createToken = async () => {
  const user = firebase.auth().currentUser
  if (user) {
    const token = await user.getIdToken()
    return `Bearer ${token}`
  }
  return null
}

export default createToken