import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useProfileStore } from '../../stores'

const defaultValues = {
  email: '',
  password: '',
}

const Login = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const signIn = useProfileStore(state => state.signIn)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ defaultValues})

  const onSubmit = async values => {
    setIsSubmitting(true)
    setError(null)
    try {
      await signIn(values.email, values.password)
      navigate('/editor')
    } catch (err) {
      setError('Incorrect email or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      {error && (
        <p>{error}</p>
      )}
      <p>email</p>
      <input {...register('email')} />
      <p>{errors.email?.message}</p>
      <p>password</p>
      <input {...register('password')} />
      <p>{errors.email?.password}</p>
      <button type='submit' disabled={!isDirty || isSubmitting}>Login</button>
    </form>
  )
}

export default Login