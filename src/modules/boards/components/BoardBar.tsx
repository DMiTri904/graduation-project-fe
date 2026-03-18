import { useMemo, useState } from 'react'
import { Filter, ArrowUpDown, MoreHorizontal, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import CreateCardDialog from './CreateCardDialog'
import type { Board } from '../types/board'
import AddMemberModal from '@/modules/groups/components/AddMemberModal'
import {
  useAddMember,
  useGetGroupMembers
} from '@/modules/groups/hooks/useGroups'
import { GroupMemberRole } from '@/modules/groups/types/group.enum'

export interface GroupMember {
  userId: number
  userName: string
  avatarUrl: string
  role: string
  joinedAt: string
}

interface BoardBarProps {
  board?: Board
  groupId?: number
  groupDetail?: any
}

export default function BoardBar({
  board,
  groupId,
  groupDetail
}: BoardBarProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const { mutateAsync: addMemberMutateAsync } = useAddMember()

  const derivedGroupId = useMemo(() => {
    const value = Number((board?._id || '').replace(/\D/g, ''))
    return Number.isFinite(value) && value > 0 ? value : 0
  }, [board?._id])

  const resolvedGroupId =
    typeof groupId === 'number' && groupId > 0 ? groupId : derivedGroupId

  // 1. GỌI API LẤY DANH SÁCH THÀNH VIÊN
  const { data: membersResponse } = useGetGroupMembers(resolvedGroupId)

  // 2. TRÍCH XUẤT DATA THẬT VÀ XỬ LÝ HIỂN THỊ
  const realMembers: GroupMember[] = membersResponse?.value || []
  const MAX_VISIBLE_AVATARS = 3
  const visibleMembers = realMembers.slice(0, MAX_VISIBLE_AVATARS)
  const remainUsers =
    realMembers.length > MAX_VISIBLE_AVATARS
      ? realMembers.length - MAX_VISIBLE_AVATARS
      : 0

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

        {/* 3. HIỂN THỊ AVATAR BẰNG DATA THẬT */}
        <div className='flex items-center -space-x-2'>
          {visibleMembers.map(user => (
            <Avatar
              key={user.userId} // Đã dùng key bằng userId chuẩn
              className='h-8 w-8 border-2 border-white cursor-pointer hover:z-10 hover:scale-105 transition-all shadow-sm'
              title={`${user.userName} - ${user.role}`}
            >
              <AvatarImage
                src={user.avatarUrl} // Lấy avatarUrl từ API
                alt={user.userName} // Đổi thành userName
                className='object-cover'
              />
              <AvatarFallback className='bg-[#A3B899] text-white text-[10px]'>
                {user.userName
                  ? user.userName.substring(0, 2).toUpperCase()
                  : 'U'}
              </AvatarFallback>
            </Avatar>
          ))}

          {/* Chỉ hiển thị số + khi thực sự có người thừa */}
          {remainUsers > 0 && (
            <div className='h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center z-10 text-xs font-semibold text-slate-600 cursor-pointer hover:bg-slate-200 shadow-sm'>
              +{remainUsers}
            </div>
          )}
        </div>

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
        <CreateCardDialog />
        <Button
          variant='outline'
          className='h-9 text-slate-600 border-slate-200 hover:bg-slate-50 font-medium shadow-sm'
        >
          <Filter className='mr-2 h-4 w-4 text-slate-500' />
          Filters
        </Button>
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
