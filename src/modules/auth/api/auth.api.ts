import api from '@/lib/axios'
import type { ApiResponse } from '@/lib/axios'
import type { LoginFormType } from '../types/login'

/**
 * Login Response from Backend
 * According to Swagger: POST /api/Auth/login
 */
export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user?: {
    id: string
    mssv: string
    name?: string
    email?: string
  }
}

/**
 * Login API
 * Endpoint: POST /api/Auth/login
 * Request Body: { mssv: string, password: string }
 */
export const login = async (
  payload: LoginFormType
): Promise<ApiResponse<LoginResponse>> => {
  const { data } = await api.post<ApiResponse<LoginResponse>>(
    '/Auth/login',
    payload
  )
  return data
}

/**
 * Forgot Password API
 */
export const forgotPassword = async (payload: {
  mssv: string
}): Promise<ApiResponse<any>> => {
  const { data } = await api.post<ApiResponse<any>>(
    '/api/Auth/forgot-password',
    payload
  )
  return data
}

/**
 * Reset Password API
 */
export const resetPassword = async (
  payload: any
): Promise<ApiResponse<any>> => {
  const { data } = await api.post<ApiResponse<any>>(
    '/api/Auth/reset-password',
    payload
  )
  return data
}
