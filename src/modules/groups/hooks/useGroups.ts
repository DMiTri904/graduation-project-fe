import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getGroups,
  getGroupById,
  createGroup,
  joinGroup,
  deleteGroup
} from '../api/group.api'
import type { CreateGroupPayload, JoinGroupPayload } from '../types/group'

/**
 * Query Keys
 */
export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  list: (filters: string) => [...groupKeys.lists(), { filters }] as const,
  details: () => [...groupKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupKeys.details(), id] as const
}

/**
 * Hook: Get all groups
 */
export const useGetGroups = () => {
  return useQuery({
    queryKey: groupKeys.lists(),
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}

/**
 * Hook: Get group by ID
 */
export const useGetGroupById = (id: string) => {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => getGroupById(id),
    enabled: !!id
  })
}

/**
 * Hook: Create new group
 */
export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateGroupPayload) => createGroup(payload),
    onSuccess: () => {
      // Invalidate and refetch groups list
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
    },
    onError: error => {
      console.error('Create group failed:', error)
    }
  })
}

/**
 * Hook: Join group
 */
export const useJoinGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: JoinGroupPayload) => joinGroup(payload),
    onSuccess: () => {
      // Invalidate and refetch groups list
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
    },
    onError: error => {
      console.error('Join group failed:', error)
    }
  })
}

/**
 * Hook: Delete group
 */
export const useDeleteGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
    }
  })
}
