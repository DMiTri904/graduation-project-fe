import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getGroups,
  getGroupById,
  joinGroup,
  deleteGroup,
  createGroupAPI,
  addMemberToGroupAPI,
  deleteGroupMemberAPI,
  getGroupDetailAPI,
  getGroupMembersAPI,
  updateGroupInfoAPI,
  updateGroupGithubRepoAPI,
  type UpdateGroupInfoRequest,
  type UpdateGroupGithubRepoRequest
} from '../api/group.api'
import type { JoinGroupPayload } from '../types/group'
import type {
  AddMemberRequest,
  CreateGroupRequest
} from '../types/group.request'
import { toast } from 'sonner'

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

export const useGetGroupDetail = (groupId: number) => {
  return useQuery({
    // Ép kiểu groupId sang string để dùng chung bộ key groupKeys.detail() của bạn
    queryKey: groupKeys.detail(groupId.toString()),
    queryFn: () => getGroupDetailAPI(groupId),
    // Chỉ gọi API khi groupId là 1 số hợp lệ (lớn hơn 0)
    enabled: typeof groupId === 'number' && groupId > 0
    // staleTime: 1000 * 60 * 5 // Cache 5 phút cho đỡ gọi lại nhiều
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
    mutationFn: (body: CreateGroupRequest) => createGroupAPI(body),
    onSuccess: response => {
      toast.success('Thành công', {
        description: 'Tạo nhóm thành công!'
      })
      // Báo cho React Query biết là dữ liệu nhóm đã cũ, cần tải lại danh sách mới
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: (error: any) => {
      toast.error('Thất bại', {
        description: error?.response?.data?.message || 'Có lỗi khi tạo nhóm.'
      })
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

/**
 * Hook: Add member to group
 */
export const useAddMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      groupId,
      body
    }: {
      groupId: number
      body: AddMemberRequest
    }) => addMemberToGroupAPI(groupId, body),
    onSuccess: () => {
      toast.success('Thành công', {
        description: 'Đã thêm thành viên vào nhóm.'
      })

      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: (error: any) => {
      toast.error('Thất bại', {
        description:
          error?.response?.data?.message ||
          'Không thể thêm thành viên. Vui lòng thử lại.'
      })
    }
  })
}

export const useGetGroupMembers = (groupId: number) => {
  return useQuery({
    // Tạo một key mới để react-query quản lý riêng data này
    queryKey: [...groupKeys.detail(groupId.toString()), 'members'],
    queryFn: () => getGroupMembersAPI(groupId),
    enabled: typeof groupId === 'number' && groupId > 0
  })
}

export const useDeleteGroupMember = (groupId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => deleteGroupMemberAPI(groupId, userId),
    onSuccess: (_, userId) => {
      queryClient.setQueryData(
        [...groupKeys.detail(groupId.toString()), 'members'],
        (oldData: any) => {
          if (!oldData) return oldData

          if (Array.isArray(oldData)) {
            return oldData.filter(item => {
              const targetUserId = Number(item?.userId ?? item?.id)
              return targetUserId !== userId
            })
          }

          const rawMembers = Array.isArray(oldData.value) ? oldData.value : []

          return {
            ...oldData,
            value: rawMembers.filter((item: any) => {
              const targetUserId = Number(item?.userId ?? item?.id)
              return targetUserId !== userId
            })
          }
        }
      )
    }
  })
}

export const useUpdateGroupInfo = (groupId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateGroupInfoRequest) =>
      updateGroupInfoAPI(groupId, body),
    onSuccess: () => {
      toast.success('Thành công', {
        description: 'Đã cập nhật thông tin nhóm.'
      })

      queryClient.invalidateQueries({
        queryKey: groupKeys.detail(groupId.toString())
      })
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
    },
    onError: (error: any) => {
      toast.error('Thất bại', {
        description:
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          'Không thể cập nhật thông tin nhóm. Vui lòng thử lại.'
      })
    }
  })
}

export const useUpdateGroupGithubRepo = (groupId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateGroupGithubRepoRequest) =>
      updateGroupGithubRepoAPI(groupId, body),
    onSuccess: () => {
      toast.success('Thành công', {
        description: 'Đã cập nhật link GitHub repository.'
      })

      queryClient.invalidateQueries({
        queryKey: groupKeys.detail(groupId.toString())
      })
    },
    onError: (error: any) => {
      toast.error('Thất bại', {
        description:
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          'Không thể cập nhật link GitHub repository. Vui lòng thử lại.'
      })
    }
  })
}
