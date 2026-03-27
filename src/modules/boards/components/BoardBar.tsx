import { useEffect, useMemo, useState } from 'react'
import { Filter, ArrowUpDown, MoreHorizontal, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import CreateCardDialog from './CreateCardDialog'
import type { Board } from '../types/board'
import AddMemberModal from '@/modules/groups/components/AddMemberModal'
import ManageMembersModal from '@/modules/groups/components/ManageMembersModal'
import {
  useAddMember,
  useGetGroupMembers
} from '@/modules/groups/hooks/useGroups'
import { GroupMemberRole } from '@/modules/groups/types/group.enum'
import { useBoardStore } from '../stores/useBoardStore'
import { getCurrentUserFromToken } from '@/lib/token'
import {
  getAvatarColorClass,
  getAvatarFallback,
  getAvatarSrc
} from '@/lib/avatar'

export interface GroupMember {
  id: number
  userId?: number
  userName: string
  userCode: string
  avatarUrl: string | null
  isActive: boolean
  role: string
}

interface BoardBarProps {
  board?: Board
  groupId?: number
  groupDetail?: any
  isMyTasksOnly: boolean
  onMyTasksOnlyChange: (value: boolean) => void
  onClearFilters: () => void
}

export default function BoardBar({
  board,
  groupId,
  groupDetail,
  isMyTasksOnly,
  onMyTasksOnlyChange,
  onClearFilters
}: BoardBarProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const { mutateAsync: addMemberMutateAsync } = useAddMember()
  const setCurrentGroupMembers = useBoardStore(
    state => state.setCurrentGroupMembers
  )
  const tokenUser = getCurrentUserFromToken()

  const derivedGroupId = useMemo(() => {
    const value = Number((board?._id || '').replace(/\D/g, ''))
    return Number.isFinite(value) && value > 0 ? value : 0
  }, [board?._id])

  const resolvedGroupId =
    typeof groupId === 'number' && groupId > 0 ? groupId : derivedGroupId

  // 1. GỌI API LẤY DANH SÁCH THÀNH VIÊN
  const { data: membersResponse } = useGetGroupMembers(resolvedGroupId)

  // 2. TRÍCH XUẤT DATA THẬT VÀ XỬ LÝ HIỂN THỊ
  const realMembers = useMemo<GroupMember[]>(() => {
    const rawMembers = Array.isArray(membersResponse?.value)
      ? membersResponse.value
      : []

    return rawMembers
      .map((member: any) => {
        const rawMemberId = Number(member?.id)
        const rawUserId = Number(member?.userId ?? member?.id)

        const memberId =
          Number.isFinite(rawMemberId) && rawMemberId > 0 ? rawMemberId : null
        const userId =
          Number.isFinite(rawUserId) && rawUserId > 0 ? rawUserId : null

        if (!memberId && !userId) {
          return null
        }

        const resolvedMemberId = memberId ?? userId ?? 0
        const resolvedUserId = userId ?? memberId ?? 0

        return {
          id: resolvedMemberId,
          userId: resolvedUserId,
          userName:
            member?.userName || member?.fullName || `User #${resolvedUserId}`,
          userCode: member?.userCode || '',
          avatarUrl: member?.avatarUrl ?? null,
          isActive: member?.isActive ?? true,
          role: member?.role || ''
        }
      })
      .filter(
        (member: GroupMember | null): member is GroupMember => member !== null
      )
  }, [membersResponse?.value])

  const activeMembers = useMemo(
    () => realMembers.filter(member => member.isActive !== false),
    [realMembers]
  )

  useEffect(() => {
    setCurrentGroupMembers(activeMembers)
  }, [activeMembers, setCurrentGroupMembers])
  const MAX_VISIBLE_AVATARS = 3
  const visibleMembers = activeMembers.slice(0, MAX_VISIBLE_AVATARS)
  const remainUsers =
    activeMembers.length > MAX_VISIBLE_AVATARS
      ? activeMembers.length - MAX_VISIBLE_AVATARS
      : 0

  const currentMember = useMemo(() => {
    if (!tokenUser.id) return null
    return (
      activeMembers.find(
        member => member.userId === tokenUser.id || member.id === tokenUser.id
      ) || null
    )
  }, [activeMembers, tokenUser.id])

  const handleConfirmAddMember = async (payload: {
    userId: number
    role: 'Member' | 'Leader'
  }) => {
    await addMemberMutateAsync({
      groupId: resolvedGroupId,
      body: {
        userId: payload.userId,
        role:
          payload.role === 'Leader'
            ? GroupMemberRole.Leader
            : GroupMemberRole.Member
      }
    })
  }

  return (
    <div className='w-full h-17 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0'>
      <div className='flex items-center gap-5'>
        <h1 className='text-xl font-bold text-slate-900 tracking-tight'>
          {groupDetail?.name || board?.title || 'Loading...'}
        </h1>

        <ManageMembersModal
          groupId={resolvedGroupId}
          currentUser={{
            id: tokenUser.id,
            role: currentMember?.role || 'Member'
          }}
          trigger={
            <div className='flex items-center -space-x-2 rounded-md px-1.5 py-1 cursor-pointer transition-all hover:bg-slate-100 hover:shadow-sm'>
              {visibleMembers.map(user => (
                <Avatar
                  key={user.id}
                  className='h-8 w-8 border-2 border-white hover:z-10 hover:scale-105 transition-all shadow-sm'
                  title={`${user.userName} - ${user.role}`}
                >
                  <AvatarImage
                    src={getAvatarSrc(user.avatarUrl)}
                    alt={user.userName}
                    className='object-cover'
                  />
                  <AvatarFallback
                    className={`${getAvatarColorClass(user.userName)} text-white text-[10px] font-medium`}
                  >
                    {getAvatarFallback(user.userName)}
                  </AvatarFallback>
                </Avatar>
              ))}

              {remainUsers > 0 && (
                <div className='h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center z-10 text-xs font-semibold text-slate-600 hover:bg-slate-200 shadow-sm'>
                  +{remainUsers}
                </div>
              )}
            </div>
          }
        />

        <Button
          className='h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 font-medium shadow-sm'
          onClick={() => setIsInviteModalOpen(true)}
          disabled={resolvedGroupId <= 0}
        >
          <UserPlus className='mr-2 h-4 w-4' />
          Invite
        </Button>

        <AddMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          groupId={resolvedGroupId}
          groupName={groupDetail?.name}
          onConfirm={handleConfirmAddMember}
        />
      </div>

      <div className='flex items-center gap-2.5'>
        <CreateCardDialog groupId={resolvedGroupId} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className={`h-9 font-medium shadow-sm ${
                isMyTasksOnly
                  ? 'text-blue-700 border-blue-300 bg-blue-50 hover:bg-blue-100'
                  : 'text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter
                className={`mr-2 h-4 w-4 ${
                  isMyTasksOnly ? 'text-blue-600' : 'text-slate-500'
                }`}
              />
              Filters
              {isMyTasksOnly && (
                <span className='ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white'>
                  1
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='start' className='w-56'>
            <DropdownMenuLabel>Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
              checked={isMyTasksOnly}
              onCheckedChange={checked => onMyTasksOnlyChange(checked === true)}
            >
              Just my cards
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!isMyTasksOnly}
              onClick={onClearFilters}
            >
              Clear filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant='outline'
          className='h-9 text-slate-600 border-slate-200 hover:bg-slate-50 font-medium shadow-sm'
        >
          <ArrowUpDown className='mr-2 h-4 w-4 text-slate-500' />
          Sort
        </Button>
        <Button
          variant='outline'
          size='icon'
          className='h-9 w-9 text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'
        >
          <MoreHorizontal className='h-4 w-4 text-slate-500' />
        </Button>
      </div>
    </div>
  )
}
