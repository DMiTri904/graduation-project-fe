export interface Card {
  _id: string
  boardId: string
  columnId: string
  issueKey?: string
  title?: string
  description?: string | null
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: string | null
  reporter?: string
  dueDate?: string
  createdAt?: string
  updatedAt?: string
  memberIds?: string[]
  comments?: string[]
  attachments?: string[]
  FE_PlaceholderCard?: boolean
}

export interface Column {
  _id: string
  boardId: string
  title: string
  cardOrderIds: string[]
  cards: Card[]
}

export interface Board {
  _id: string
  title: string
  description: string
  type: 'public' | 'private'
  ownerIds: string[]
  memberIds: string[]
  columnOrderIds: string[]
  columns: Column[]
}

export interface GroupMember {
  userId: number
  userName: string
  avatarUrl: string
  role: string
  joinedAt: string
}
