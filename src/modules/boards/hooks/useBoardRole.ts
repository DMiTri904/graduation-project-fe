import { useMemo } from 'react'
import type { GroupMember } from '../types/board'
import type { TokenUserInfo } from '@/lib/token'

interface UseBoardRoleParams {
  tokenUser: TokenUserInfo
  currentGroupMembers: GroupMember[]
}

const toValidUserId = (value: unknown): number | null => {
  const normalized = Number(value)
  if (!Number.isFinite(normalized) || normalized <= 0) {
    return null
  }

  return normalized
}

export const useBoardRole = ({
  tokenUser,
  currentGroupMembers
}: UseBoardRoleParams): string => {
  return useMemo(() => {
    const currentUserId = toValidUserId(tokenUser.id)
    if (!currentUserId) return 'Member'

    const matchedMember = currentGroupMembers.find(member => {
      const memberUserId = toValidUserId(member.userId ?? member.id)
      return memberUserId === currentUserId
    })

    return matchedMember?.role || 'Member'
  }, [currentGroupMembers, tokenUser.id])
}
