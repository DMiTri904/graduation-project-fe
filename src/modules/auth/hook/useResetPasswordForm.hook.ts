import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ResetPasswordSchema,
  type ResetPasswordFormType
} from '../types/reset-password'
import { useState } from 'react'

interface UseResetPasswordFormProps {
  email: string
  onSubmit: (data: ResetPasswordFormType) => Promise<void>
}

export const useResetPasswordForm = ({
  email,
  onSubmit
}: UseResetPasswordFormProps) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors
  } = useForm<ResetPasswordFormType>({
    resolver: yupResolver(ResetPasswordSchema),
    mode: 'onChange'
  })

  const handleFormSubmit = async (data: ResetPasswordFormType) => {
    try {
      setLoading(true)
      await onSubmit(data)
    } catch (error) {
      console.error('Reset password error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.getElementById('passwordConfirm')?.focus()
    }
  }

  const handleConfirmKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(handleFormSubmit)()
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    errors,
    clearErrors,
    loading,
    canSubmit: isValid && !loading,
    handlePasswordKeyDown,
    handleConfirmKeyDown,
    email
  }
}
