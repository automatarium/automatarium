import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { firebase } from '../../auth'
import { createUser } from '../../services'

const defaultValues = {
  email: '',
  password: '',
  passwordAgain: ''
}

const Signup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    setError: setFieldError,
    formState: { errors, isDirty },
  } = useForm({ defaultValues})

  const watchPassword = watch('password')

  const onSubmit = async values => {
    setIsSubmitting(true)
    setError(null)

    try {
      const firebaseRecord = await firebase.auth().createUserWithEmailAndPassword(values.email, values.password)

      const res = await createUser({
        uid: firebaseRecord.user.uid,
        email: values.email,
        preferences: {}
      })

      if (res?.data) {
        console.log(res?.data)
      } else {
        setError(res?.error)
      }
    } catch (error) {
      if (error.code && error.code === 'auth/email-already-in-use') {
        setFieldError('email', {
          type: 'manual',
          message: 'This email is already in use',
        })
        values.email = ''
      } else if (error.response && error.response.status === 400) {
        // Field errors
        setError(error.response.data.message)
        error.response.data.fieldErrors.forEach(fieldError => {
          setFieldError(fieldError.name, {
            type: 'manual',
            message: fieldError.message,
          })
        })
      } else {
        setError('An error occured, please try again')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      {error && (
        <p>${error}</p>
      )}
      <p>email</p>
      <input {...register('email')} />
      <p>{errors.email?.message}</p>
      <p>password</p>
      <input {...register('password')} />
      <p>{errors.email?.password}</p>
      <p>confirm password</p>
      <input {...register('passwordAgain', {
        validate: value =>
        value === watchPassword || 'Passwords must match',
      })} />
      <p>{errors.passwordAgain?.message}</p>
      <button type='submit' disabled={!isDirty || isSubmitting}>Signup</button>
    </form>
  )
}

export default Signup