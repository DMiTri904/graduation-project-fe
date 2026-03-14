import api from '@/lib/axios'
import type { ApiResponse } from '@/lib/axios'

export interface UserProfileResponse {
  id?: string
  fullName?: string
  name?: string
  userName?: string
  phoneNumber?: string
  phone?: string
  email?: string
  major?: string
  specialization?: string
  studentId?: string
  mssv?: string
  userCode?: string
  avatarUrl?: string
  avatar?: string
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
  passwordConfirm: string
}

export interface ChangeAvatarPayload {
  file: File
}

const normalizeApiResponse = <T>(raw: any): ApiResponse<T> => {
  const isWrapped =
    raw &&
    typeof raw === 'object' &&
    'data' in raw &&
    ('success' in raw || 'statusCode' in raw || 'message' in raw)

  if (isWrapped) {
    return raw as ApiResponse<T>
  }

  return {
    success: true,
    statusCode: 200,
    message: '',
    data: raw as T
  }
}

export const getUserProfileAPI = async (): Promise<
  ApiResponse<UserProfileResponse>
> => {
  const { data } = await api.get('/user/profile')
  return normalizeApiResponse<UserProfileResponse>(data)
}

export const changePasswordAPI = async (
  payload: ChangePasswordPayload
): Promise<ApiResponse<null>> => {
  const { data } = await api.put<ApiResponse<null>>(
    '/user/change-password',
    payload
  )
  return data
}

export const changeAvatarAPI = async (
  payload: ChangeAvatarPayload
): Promise<ApiResponse<UserProfileResponse>> => {
  const formData = new FormData()
  formData.append('file', payload.file)

  const { data } = await api.put('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return normalizeApiResponse<UserProfileResponse>(data)
}
