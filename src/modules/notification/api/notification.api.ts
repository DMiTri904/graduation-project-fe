import api from '@/lib/axios'

export interface NotificationDto {
  id: number
  content: string
  isRead: boolean
  createdAt: string
  title?: string
  type?: string
  link?: string
}

interface NotificationListResponse {
  value?: NotificationDto[]
  data?: NotificationDto[]
}

const normalizeNotifications = (payload: unknown): NotificationDto[] => {
  if (Array.isArray(payload)) return payload as NotificationDto[]

  const response = payload as NotificationListResponse | null | undefined

  if (Array.isArray(response?.value)) return response.value
  if (Array.isArray(response?.data)) return response.data

  return []
}

export const getNotificationsAPI = async (): Promise<NotificationDto[]> => {
  const response = await api.get<NotificationDto[] | NotificationListResponse>(
    '/notification'
  )

  return normalizeNotifications(response.data)
}

export const markAsReadAPI = async (id: number) => {
  const response = await api.put(`/notification/${id}/read`)
  return response.data
}

export const markAllAsReadAPI = async () => {
  const response = await api.put('/notification/read-all')
  return response.data
}
