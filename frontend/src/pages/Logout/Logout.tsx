import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import useProjectsStore from '/src/stores/useProjectsStore'

import { useAuth } from '/src/hooks'

const Logout = () => {
  const { signOut, loading } = useAuth()
  const clearProjects = useProjectsStore(s => s.clearProjects)

  useEffect(() => {
    (async () => {
      await signOut()
      clearProjects()
    })()
  }, [])

  return loading
    ? (
    <div style={{
      height: '100%',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <p>test</p>
    </div>
      )
    : <>
    <p>Signed out</p>
    <Navigate to='/new'/>
  </>
}

export default Logout
