import api from '@/lib/axios'

export interface TaskDto {
  id: number | string
  title: string
  description?: string | null
  status?: string
  priority?: string
  assignedTo?: number | null
  startDate?: string | null
  dueDate?: string | null
  completedAt?: string | null
  groupId?: number
  createdBy?: number
  createdAt?: string
  updatedAt?: string
}

interface TaskListResponse {
  value?: TaskDto[]
  data?: TaskDto[]
  isSuccess?: boolean
  isFailure?: boolean
  error?: {
    code?: string
    message?: string
  }
}

export interface CreateGroupTaskPayload {
  title: string
  description?: string
  taskStatus: 'ToDo' | 'InProgress' | 'Test' | 'Done'
  priority: 'High' | 'Medium' | 'Low'
  dueDate?: string
  assignedTo: number
}

export interface AssignTaskPayload {
  assignedTo: number
}

export interface UpdateTaskDueDatePayload {
  dateTime: string | null
}

export interface UpdateTaskPayload {
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  taskStatus: 'ToDo' | 'InProgress' | 'Test' | 'Done'
  assignedTo: number
  dueDate: string | null
}

export type TaskTransitionAction = 'start' | 'test' | 'complete' | 'reject'

export const getGroupTasksAPI = async (groupId: number): Promise<TaskDto[]> => {
  const response = await api.get<TaskListResponse | TaskDto[]>(
    `/group/${groupId}/tasks`
  )

  const payload = response.data

  if (Array.isArray(payload)) {
    return payload
  }

  if (payload?.isFailure) {
    throw new Error(payload?.error?.message || 'Không thể tải danh sách task')
  }

  if (Array.isArray(payload?.value)) {
    return payload.value
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

export const getMyGroupTasksAPI = async (
  groupId: number
): Promise<TaskDto[]> => {
  const response = await api.get<TaskListResponse | TaskDto[]>(
    `/group/${groupId}/my-task`
  )

  const payload = response.data

  if (Array.isArray(payload)) {
    return payload
  }

  if (payload?.isFailure) {
    throw new Error(payload?.error?.message || 'Không thể tải task của bạn')
  }

  if (Array.isArray(payload?.value)) {
    return payload.value
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

export const createGroupTaskAPI = async (
  groupId: number,
  body: CreateGroupTaskPayload
) => {
  const response = await api.post(`/group/${groupId}/tasks`, body)
  return response.data
}

export const assignTaskAPI = async (
  taskId: number,
  assignedTo: number | null
) => {
  const response = await api.put(`/task/${taskId}/assign`, {
    assignedTo: assignedTo ?? 0
  } satisfies AssignTaskPayload)
  return response.data
}

export const updateTaskDueDateAPI = async (
  taskId: number,
  dateTime: string | null
) => {
  const response = await api.put(`/task/${taskId}/due-date`, {
    dateTime
  } satisfies UpdateTaskDueDatePayload)
  return response.data
}

export const deleteTaskAPI = async (taskId: number) => {
  const response = await api.delete(`/task/${taskId}`)
  return response.data
}

export const updateTaskAPI = async (
  taskId: number,
  body: UpdateTaskPayload
) => {
  const response = await api.put(`/task/${taskId}`, body)
  return response.data
}

export const transitionTaskStatusAPI = async (
  taskId: number,
  action: TaskTransitionAction
) => {
  const response = await api.put(`/task/${taskId}/${action}`)
  return response.data
}
