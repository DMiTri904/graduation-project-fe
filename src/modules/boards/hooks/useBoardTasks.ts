import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  assignTaskAPI,
  createGroupTaskAPI,
  getMyGroupTasksAPI,
  deleteTaskAPI,
  getGroupTasksAPI,
  transitionTaskStatusAPI,
  updateTaskAPI,
  updateTaskDueDateAPI,
  type CreateGroupTaskPayload,
  type TaskTransitionAction
} from '../api/task.api'
import { getGroupMembersAPI } from '@/modules/groups/api/group.api'

export interface GroupMemberOption {
  userId: number
  userName: string
  avatarUrl?: string
  role?: string
  email?: string
}

interface GroupMembersResponse {
  value?: GroupMemberOption[]
}

type GroupMemberOptionLike = Partial<GroupMemberOption> & {
  id?: number | string
  fullName?: string
  name?: string
  avatar?: string
}

const normalizeMemberOption = (
  member: GroupMemberOptionLike
): GroupMemberOption | null => {
  const rawUserId = member.userId ?? member.id
  const userId = Number(rawUserId)

  if (!Number.isFinite(userId) || userId <= 0) {
    return null
  }

  const userName =
    member.userName?.trim() ||
    member.fullName?.trim() ||
    member.name?.trim() ||
    member.email?.trim() ||
    `User #${userId}`

  return {
    userId,
    userName,
    avatarUrl: member.avatarUrl || member.avatar,
    role: member.role,
    email: member.email
  }
}

export const boardTaskKeys = {
  all: ['board-tasks'] as const,
  list: (groupId: number) => [...boardTaskKeys.all, groupId, 'all'] as const,
  myList: (groupId: number) => [...boardTaskKeys.all, groupId, 'my'] as const,
  byFilter: (groupId: number, isMyTasksOnly: boolean) =>
    isMyTasksOnly ? boardTaskKeys.myList(groupId) : boardTaskKeys.list(groupId)
}

export const useGetGroupTasks = (groupId: number) => {
  return useQuery({
    queryKey: boardTaskKeys.list(groupId),
    queryFn: () => getGroupTasksAPI(groupId),
    enabled: Number.isFinite(groupId) && groupId > 0
  })
}

export const useGetBoardTasks = (groupId: number, isMyTasksOnly: boolean) => {
  return useQuery({
    queryKey: boardTaskKeys.byFilter(groupId, isMyTasksOnly),
    queryFn: () =>
      isMyTasksOnly ? getMyGroupTasksAPI(groupId) : getGroupTasksAPI(groupId),
    enabled: Number.isFinite(groupId) && groupId > 0
  })
}

export const useGetGroupMemberOptions = (groupId: number) => {
  return useQuery({
    queryKey: [...boardTaskKeys.list(groupId), 'members'],
    queryFn: async () => {
      const response = (await getGroupMembersAPI(groupId)) as
        | GroupMembersResponse
        | GroupMemberOptionLike[]

      const rawMembers = Array.isArray(response)
        ? response
        : (response?.value ?? [])

      return rawMembers
        .map(member => normalizeMemberOption(member))
        .filter((member): member is GroupMemberOption => member !== null)
    },
    enabled: Number.isFinite(groupId) && groupId > 0
  })
}

export const useCreateGroupTask = (groupId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateGroupTaskPayload) =>
      createGroupTaskAPI(groupId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.list(groupId) })
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.myList(groupId) })
      toast.success('Tạo task thành công')
    },
    onError: (error: any) => {
      toast.error('Tạo task thất bại', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Vui lòng thử lại sau.'
      })
    }
  })
}

export const useAssignTask = (groupId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      assignedTo
    }: {
      taskId: number
      assignedTo: number | null
    }) => assignTaskAPI(taskId, assignedTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.list(groupId) })
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.myList(groupId) })
    },
    onError: (error: any) => {
      toast.error('Cập nhật người phụ trách thất bại', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Vui lòng thử lại sau.'
      })
    }
  })
}

export const useUpdateTaskDueDate = (groupId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      dateTime
    }: {
      taskId: number
      dateTime: string | null
    }) => updateTaskDueDateAPI(taskId, dateTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.list(groupId) })
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.myList(groupId) })
    },
    onError: (error: any) => {
      toast.error('Cập nhật hạn hoàn thành thất bại', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Vui lòng thử lại sau.'
      })
    }
  })
}

export const useDeleteTask = (groupId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId }: { taskId: number }) => deleteTaskAPI(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.list(groupId) })
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.myList(groupId) })
      toast.success('Xóa task thành công')
    },
    onError: (error: any) => {
      toast.error('Xóa task thất bại', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Vui lòng thử lại sau.'
      })
    }
  })
}

export const useUpdateTask = (groupId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      body
    }: {
      taskId: number
      body: {
        title: string
        description: string
        priority: 'Low' | 'Medium' | 'High'
        taskStatus: 'ToDo' | 'InProgress' | 'Test' | 'Done'
        assignedTo: number
        dueDate: string | null
      }
    }) => updateTaskAPI(taskId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.list(groupId) })
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.myList(groupId) })
    },
    onError: (error: any) => {
      toast.error('Cập nhật task thất bại', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Vui lòng thử lại sau.'
      })
    }
  })
}

export const useTransitionTaskStatus = (groupId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      action
    }: {
      taskId: number
      action: TaskTransitionAction
    }) => transitionTaskStatusAPI(taskId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.list(groupId) })
      queryClient.invalidateQueries({ queryKey: boardTaskKeys.myList(groupId) })
    },
    onError: (error: any) => {
      toast.error('Cập nhật trạng thái task thất bại', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Vui lòng thử lại sau.'
      })
    }
  })
}
