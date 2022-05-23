import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'

import { Main, TextInput, Button, Label } from '/src/components'
import { useAuth } from '/src/hooks'

const defaultValues = {
  email: '',
  password: '',
}

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [fireError, setFireError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user: currentUser, isLoading, signIn, error: authError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ defaultValues})

  // Determine previous page (if there was such a thing)
  const previousPage = location?.state?.from

  // Were there errors from fire / from signing in?
  const error = fireError || authError?.message

  // Navigate away if already logged in
  useEffect(() => {
    if (currentUser && !isSubmitting) {
      navigate('/new')
    }
  }, [currentUser])

  const onSubmit = async values => {
    setIsSubmitting(true)
    setFireError(null)
    signIn(values.email, values.password)
      .then(() => {
        setIsSubmitting(false)
        if (previousPage)
          navigate(previousPage)
      })
      .then(() => navigate('/new'))
      .catch(() => {
        setFireError('Incorrect email or password')
        setIsSubmitting(false)
      })
  }

  return <Main>
    <Main.Header center/>
    <h2>Login</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <p>{error}</p>
      )}
      <Label htmlFor='email'>Email</Label>
      <TextInput type='email' {...register('email')} />
      <p>{errors.email?.message}</p>

      <Label htmlFor='password'>Password</Label>
      <TextInput type='password' {...register('password')} />
      <p>{errors.email?.password}</p>

      <Button type='submit' disabled={!isDirty || isSubmitting}>Login</Button>
    </form>
  </Main>
}

export default Login
