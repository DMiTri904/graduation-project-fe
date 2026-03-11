import { GroupMemberRole } from './group.enum'

export interface CreateGroupRequest {
  name: string
  description?: string
  subjectOrProjectName: string
}

export interface UpdateGroupRequest {
  name?: string
  description?: string
  subjectOrProjectName?: string
}

export interface AddMemberRequest {
  userId: number
  role?: GroupMemberRole
}

export interface UpdateMemberRoleRequest {
  userId: number
  newRole: GroupMemberRole
}

export interface RemoveMemberRequest {
  userId: number
}
