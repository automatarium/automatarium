import React, { useState, useEffect, forwardRef } from 'react'
import { useForm } from 'react-hook-form'

import { Input, Button, Label, Header, Modal } from '/src/components'
import { useAuth } from '/src/hooks'

const defaultValues = {
  email: '',
  password: '',
}

const Login = {}

Login.Form = forwardRef(({ setFormActions, onComplete, ...props }, ref) => {
  const [fireError, setFireError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isLoading, signIn, error: authError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ defaultValues})

  // Were there errors from fire / from signing in?
  const error = fireError || authError?.message

  useEffect(() => {
    if (setFormActions) {
      setFormActions(<>
        <Button type='submit' form='login-form' disabled={!isDirty || isLoading || isSubmitting}>Login</Button>
      </>)
    }
  }, [isDirty, isLoading, isSubmitting, ref?.current, setFormActions])

  const onSubmit = async values => {
    setIsSubmitting(true)
    setFireError(null)
    signIn(values.email, values.password)
      .then(() => {
        setIsSubmitting(false)
      })
      .then(() => { onComplete?.() })
      .catch(e => {
        if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
          setFireError('Incorrect email or password')
        } else {
          setFireError('An error occurred, please check you are connected to the internet and try again')
        }
        setIsSubmitting(false)
      })
  }

  return <form onSubmit={handleSubmit(onSubmit)} ref={ref} id='login-form' {...props}>
    {error && (
      <p style={{ color: 'var(--error)' }}>{error}</p>
    )}
    <Label htmlFor='login-email'>Email</Label>
    <Input id='login-email' type='email' {...register('email')} />
    <p>{errors.email?.message}</p>

    <Label htmlFor='login-password'>Password</Label>
    <Input id='login-password' type='password' {...register('password')} />
    <p>{errors.email?.password}</p>
  </form>
})

Login.Modal = ({ ...props }) => {
  const [formActions, setFormActions] = useState()

  return <Modal
    actions={<>
      <Button secondary style={{ marginRight: 'auto' }} onClick={props?.onClose}>Close</Button>
      {formActions}
    </>}
    {...props}
  >
    <Header center/>
    <h2>Login</h2>
    <Login.Form
      onComplete={props?.onClose}
      setFormActions={setFormActions}
    />
  </Modal>
}

export default Login
