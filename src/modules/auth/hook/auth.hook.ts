import { useMutation } from '@tanstack/react-query'
import type { LoginFormType } from '../types/login'
import {
  login,
  type LoginResponse,
  forgotPasswordAPI,
  resetPasswordAPI,
  type ForgotPasswordPayload,
  type ResetPasswordPayload
} from '../api/auth.api'

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginFormType) => login(payload),
    onSuccess: data => {
      console.log('Login successful!', data)
    },
    onError: error => {
      console.error('Login failed:', error)
      console.log('Error details:', error.message)
    }
  })
}

/**
 * Hook for Forgot Password
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPasswordAPI(payload),
    onSuccess: data => {
      console.log('Forgot password email sent!', data)
    },
    onError: error => {
      console.error('Forgot password failed:', error)
    }
  })
}

/**
 * Hook for Reset Password
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPasswordAPI(payload),
    onSuccess: data => {
      console.log('Password reset successful!', data)
    },
    onError: error => {
      console.error('Reset password failed:', error)
    }
  })
}

// TODO: Implement change password when backend provides endpoint
// export const useChangePassword = () => {
//   return useMutation({
//     mutationFn: (payload: ChangePasswordFormType) => changePassword(payload),
//   });
// };
