import type {
  Group,
  CreateGroupPayload,
  JoinGroupPayload
} from '../types/group'
import { MOCK_GROUPS } from '../types/group'

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
  await delay(800) // Simulate network delay
  return getStoredGroups()
}

/**
 * Get group by ID (Mock API)
 */
export const getGroupById = async (id: string): Promise<Group | null> => {
  await delay(500)
  const groups = getStoredGroups()
  return groups.find(g => g.id === id) || null
}

/**
 * Create new group (Mock API)
 */
export const createGroup = async (
  payload: CreateGroupPayload
): Promise<Group> => {
  await delay(1000)

  const groups = getStoredGroups()

  // Generate random invite code
  const inviteCode =
    payload.name.substring(0, 3).toUpperCase() +
    Math.random().toString(36).substring(2, 6).toUpperCase()

  const newGroup: Group = {
    id: `group-${Date.now()}`,
    name: payload.name,
    category: payload.category,
    memberCount: 1, // Creator is the first member
    maxMembers: payload.maxMembers || 5,
    progress: 0,
    inviteCode,
    createdAt: new Date().toISOString()
  }

  groups.push(newGroup)
  saveGroups(groups)

  return newGroup
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
