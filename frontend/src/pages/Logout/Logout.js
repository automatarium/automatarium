import { Redirect } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { useProfileStore } from '../../stores'

const Logout = () => {
  const signOut = useProfileStore(state => state.signOut)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const doSignout = async () => {
      await signOut()
      setLoading(false)
    }

    doSignout()
  }, [signOut])

  return loading ? (
    <div style={{
      height: '100%',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <p>test</p>
    </div>
  ) : <p>Signed out</p>
}

export default Logout
