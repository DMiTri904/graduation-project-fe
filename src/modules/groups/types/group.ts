/**
 * Group Interface
 */
export interface Group {
  id: string
  name: string
  category: string
  memberCount: number
  maxMembers: number
  progress: number
  inviteCode?: string
  createdAt?: string
}

/**
 * Create Group Payload
 */
export interface CreateGroupPayload {
  name: string
  category: string
  maxMembers?: number
}

/**
 * Join Group Payload
 */
export interface JoinGroupPayload {
  inviteCode: string
}

/**
 * Mock Data
 */
export const MOCK_GROUPS: Group[] = [
  {
    id: 'group-001',
    name: 'MERN Stack E-commerce',
    category: 'Web Development',
    memberCount: 4,
    maxMembers: 5,
    progress: 75,
    inviteCode: 'MERN2024',
    createdAt: '2024-01-15'
  },
  {
    id: 'group-002',
    name: 'React Native Mobile App',
    category: 'Mobile Development',
    memberCount: 3,
    maxMembers: 4,
    progress: 45,
    inviteCode: 'MOBILE99',
    createdAt: '2024-02-10'
  },
  {
    id: 'group-003',
    name: 'AI Chatbot with Python',
    category: 'Artificial Intelligence',
    memberCount: 5,
    maxMembers: 5,
    progress: 90,
    inviteCode: 'AI2024',
    createdAt: '2024-01-20'
  },
  {
    id: 'group-004',
    name: 'Cloud Infrastructure Project',
    category: 'DevOps & Cloud',
    memberCount: 2,
    maxMembers: 6,
    progress: 30,
    inviteCode: 'CLOUD88',
    createdAt: '2024-03-01'
  }
]

/**
 * Category Options
 */
export const GROUP_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Artificial Intelligence',
  'Machine Learning',
  'DevOps & Cloud',
  'Data Science',
  'Blockchain',
  'Cybersecurity',
  'Game Development',
  'IoT',
  'Other'
] as const

export type GroupCategory = (typeof GROUP_CATEGORIES)[number]
