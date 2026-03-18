import api from '@/lib/axios'
import type {
  Group,
  CreateGroupPayload,
  JoinGroupPayload
} from '../types/group'
import { MOCK_GROUPS } from '../types/group'
import type {
  AddMemberRequest,
  CreateGroupRequest
} from '../types/group.request'

interface GroupListItemDto {
  id: number
  name: string
  subjectOrProjectName: string
  isActive: boolean
}

interface GroupListResponseDto {
  value: GroupListItemDto[]
  isSuccess: boolean
  isFailure: boolean
  error?: {
    code: string
    message: string
  }
}

/**
 * Simulate API delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Local storage key for groups
 */
const STORAGE_KEY = 'mock_groups'

/**
 * Get groups from localStorage or use default mock data
 */
const getStoredGroups = (): Group[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : MOCK_GROUPS
}

/**
 * Save groups to localStorage
 */
const saveGroups = (groups: Group[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
}

/**
 * Get all groups (Mock API)
 */
export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get<GroupListResponseDto>('/group')
  const payload = response.data

  if (!payload?.isSuccess) {
    throw new Error(payload?.error?.message || 'Không thể tải danh sách nhóm')
  }

  return (payload.value || []).map(item => ({
    id: String(item.id),
    name: item.name,
    category: item.subjectOrProjectName || 'General',
    memberCount: 0,
    maxMembers: 5,
    progress: item.isActive ? 100 : 0
  }))
}

/**
 * Get group by ID (Mock API)
 */
export const getGroupById = async (id: string): Promise<Group | null> => {
  await delay(500)
  const groups = getStoredGroups()
  return groups.find(g => g.id === id) || null
}

export const createGroupAPI = async (body: CreateGroupRequest) => {
  // Thay url '/api/group' bằng đúng endpoint trên Swagger của bạn
  const response = await api.post('/group', body)
  return response.data
}

/**
 * Add member to group
 * Endpoint: POST /api/group/{groupId}/member
 */
export const addMemberToGroupAPI = async (
  groupId: number,
  body: AddMemberRequest
) => {
  const response = await api.post(`/group/${groupId}/member`, body)
  return response.data
}

export const getGroupDetailAPI = async (groupId: number) => {
  const response = await api.get(`/group/${groupId}/detail`)
  return response.data
}

export const getGroupMembersAPI = async (groupId: number) => {
  const response = await api.get(`/group/${groupId}/members`)
  return response.data
}
/**
 * Join group by invite code (Mock API)
 */
export const joinGroup = async (payload: JoinGroupPayload): Promise<Group> => {
  await delay(1000)

  const groups = getStoredGroups()
  const group = groups.find(g => g.inviteCode === payload.inviteCode)

  if (!group) {
    throw new Error('Mã tham gia không hợp lệ')
  }

  if (group.memberCount >= group.maxMembers) {
    throw new Error('Nhóm đã đầy')
  }

  // Increment member count
  group.memberCount += 1

  saveGroups(groups)

  return group
}

/**
 * Delete group (Mock API)
 */
export const deleteGroup = async (id: string): Promise<void> => {
  await delay(800)

  const groups = getStoredGroups()
  const filtered = groups.filter(g => g.id !== id)
  saveGroups(filtered)
}
