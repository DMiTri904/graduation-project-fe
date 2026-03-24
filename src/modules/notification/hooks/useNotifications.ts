import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getNotificationsAPI,
  markAllAsReadAPI,
  markAsReadAPI,
  type NotificationDto
} from '../api/notification.api'

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const
}

export const useGetNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: getNotificationsAPI
  })
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => markAsReadAPI(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        notificationKeys.lists(),
        (oldData: NotificationDto[] | undefined) => {
          if (!Array.isArray(oldData)) return oldData

          return oldData.map(item =>
            item.id === id ? { ...item, isRead: true } : item
          )
        }
      )
    }
  })
}

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllAsReadAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
    }
  })
}
