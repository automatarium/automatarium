import React, {
  useState,
  useEffect,
  forwardRef,
  ReactNode, Ref
} from 'react'
import { useForm } from 'react-hook-form'

import { Input, Button, Label, Header, Modal } from '/src/components'
import { useAuth } from '/src/hooks'

const defaultValues = {
  email: '',
  password: ''
}

interface LoginFormProps {
  onComplete: () => void
  setFormActions: (x: ReactNode) => void
}

const LoginForm = forwardRef(({ setFormActions, onComplete, ...props }: LoginFormProps, ref: Ref<HTMLFormElement>) => {
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { loading: isLoading, signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm({ defaultValues })

  useEffect(() => {
    if (setFormActions) {
      setFormActions(<>
        <Button type='submit' form='login-form' disabled={!isDirty || isLoading || isSubmitting}>Login</Button>
      </>)
    }
  }, [isDirty, isLoading, isSubmitting, ref, setFormActions])
  const onSubmit = async values => {
    setIsSubmitting(true)
    setError(null)
    signIn(values.email, values.password)
      .then(() => {
        setIsSubmitting(false)
      })
      .then(() => { onComplete?.() })
      .catch(e => {
        if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
          setError('Incorrect email or password')
        } else {
          setError('An error occurred, please check you are connected to the internet and try again')
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
    <p>{errors.password?.message}</p>
  </form>
})

const LoginModal = ({ ...props }) => {
  const [formActions, setFormActions] = useState<ReactNode>()

  return <Modal
    actions={<>
      <Button secondary style={{ marginRight: 'auto' }} onClick={props?.onClose}>Close</Button>
      {formActions}
    </>}
    {...props}
  >
    <Header center/>
    <h2>Login</h2>
    <LoginForm
      onComplete={props?.onClose}
      setFormActions={setFormActions}
    />
  </Modal>
}

export default LoginModal
