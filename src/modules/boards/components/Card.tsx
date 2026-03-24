import { useMemo, useState } from 'react'
import { Clock, User, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Card as CardType } from '../types/board'
import CardDetailSheet from './CardDetailSheet'
import { useBoardStore } from '../stores/useBoardStore'
import { useAssignTask } from '../hooks/useBoardTasks'
import { formatIssueKey } from '~/utils/formatters'
import { formatDueDateForCard } from '@/utils/boardFormatters'
import { getCurrentUserFromToken } from '@/lib/token'
import {
  getAvatarColorClass,
  getAvatarFallback,
  getAvatarSrc
} from '@/lib/avatar'
import {
  getPriorityConfig,
  PRIORITY_OPTIONS,
  type PriorityLevel
} from '~/utils/priority'

interface CardProps {
  card: CardType
}

function TrelloCard({ card }: CardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAssignPopoverOpen, setIsAssignPopoverOpen] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  const { updateCard, currentGroupMembers, currentUser } = useBoardStore()

  const taskId = useMemo(() => {
    const id = Number(String(card._id || '').replace(/\D/g, ''))
    return Number.isFinite(id) && id > 0 ? id : 0
  }, [card._id])

  const groupId = useMemo(() => {
    const id = Number(String(card.boardId || '').replace(/\D/g, ''))
    return Number.isFinite(id) && id > 0 ? id : 0
  }, [card.boardId])

  const { mutateAsync: assignTaskMutateAsync } = useAssignTask(groupId)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '2px solid #10b981' : undefined
  }

  const getDueDateMeta = (dateString?: string) => {
    const formatted = formatDueDateForCard(dateString)
    if (!formatted || !dateString) return null

    const parsedDate = new Date(dateString)
    const now = new Date()
    const isOverdue = parsedDate.getTime() < now.getTime()

    return {
      formatted,
      isOverdue
    }
  }

  // Get priority configuration
  const priorityConfig = getPriorityConfig(card?.priority)

  const assignedUser = currentGroupMembers?.find(
    m => m.id === card.assignedTo || m.userId === card.assignedTo
  )

  const currentUserMember = useMemo(() => {
    if (!currentGroupMembers?.length) return null

    if (currentUser) {
      const matchedByStore = currentGroupMembers.find(
        member =>
          member.id === currentUser.id ||
          member.userId === currentUser.id ||
          (typeof currentUser.userId === 'number' &&
            (member.id === currentUser.userId ||
              member.userId === currentUser.userId))
      )
      if (matchedByStore) return matchedByStore
    }

    const tokenUser = getCurrentUserFromToken()
    const normalizedName = (tokenUser.fullName || '').trim().toLowerCase()
    const normalizedCode = (tokenUser.studentId || '').trim().toLowerCase()

    return (
      currentGroupMembers.find(member => {
        const memberName = (member.userName || '').trim().toLowerCase()
        const memberCode = (member.userCode || '').trim().toLowerCase()

        return (
          (!!normalizedCode && memberCode === normalizedCode) ||
          (!!normalizedName && memberName === normalizedName)
        )
      }) || null
    )
  }, [currentGroupMembers, currentUser])

  const handleAssignToMe = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentUserMember) {
      const assignTarget = currentUserMember.id
      const assignedToForUi = currentUserMember.userId ?? currentUserMember.id

      if (taskId > 0 && groupId > 0) {
        await assignTaskMutateAsync({ taskId, assignedTo: assignTarget })
      }
      updateCard(card._id, { assignedTo: assignedToForUi })
    }
    setIsAssignPopoverOpen(false)
  }

  // Đổi type của userId thành number cho khớp với giao diện
  const handleAssignToUser = async (
    memberId: number,
    assignedUserId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    if (taskId > 0 && groupId > 0) {
      await assignTaskMutateAsync({ taskId, assignedTo: memberId })
    }
    updateCard(card._id, { assignedTo: assignedUserId })
    setIsAssignPopoverOpen(false)
  }

  const handleUnassign = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (taskId > 0 && groupId > 0) {
      await assignTaskMutateAsync({ taskId, assignedTo: null })
    }
    updateCard(card._id, { assignedTo: null })
    setIsAssignPopoverOpen(false)
  }

  const handlePriorityChange = (
    priority: PriorityLevel,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    updateCard(card._id, { priority })
    setIsPriorityDropdownOpen(false)
  }

  if (card?.FE_PlaceholderCard) {
    return (
      <div
        ref={setNodeRef}
        style={{ display: 'none' }}
        {...attributes}
        {...listeners}
      />
    )
  }

  const dueDate = getDueDateMeta(card?.dueDate)

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragging) return
    setIsDetailOpen(true)
  }

  return (
    <>
      <Card
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        onClick={handleCardClick}
        className='cursor-pointer shadow-sm hover:shadow-md transition-shadow bg-white'
      >
        <CardContent className='p-3 space-y-2'>
          {/* Title */}
          <h4 className='text-sm font-medium text-slate-900 line-clamp-2'>
            {card?.title || 'Untitled'}
          </h4>

          {/* Metadata Row */}
          <div className='flex items-center gap-2 flex-wrap'>
            {/* Issue Key Badge */}
            <Badge
              variant='outline'
              className='text-xs font-mono text-blue-600 border-blue-200'
            >
              {formatIssueKey(card._id, card.issueKey)}
            </Badge>

            {/* Quick Priority Dropdown */}
            {card?.priority && (
              <DropdownMenu
                open={isPriorityDropdownOpen}
                onOpenChange={setIsPriorityDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border transition-colors hover:shadow-sm ${priorityConfig.bgColor} ${priorityConfig.textColor} ${priorityConfig.borderColor}`}
                    onClick={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                  >
                    <span className={priorityConfig.color}>
                      {priorityConfig.icon}
                    </span>
                    {priorityConfig.label}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='start'
                  onClick={e => e.stopPropagation()}
                  onPointerDown={e => e.stopPropagation()}
                >
                  {PRIORITY_OPTIONS.map(option => {
                    const config = getPriorityConfig(option.value)
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={e => handlePriorityChange(option.value, e)}
                        onPointerDown={e => e.stopPropagation()}
                      >
                        <span className={`mr-2 ${config.color}`}>
                          {config.icon}
                        </span>
                        <span className={`${config.color} font-medium`}>
                          {config.label}
                        </span>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Due Date */}
            {dueDate && (
              <Badge
                variant='outline'
                className={`text-xs ${dueDate.isOverdue ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700'}`}
              >
                <Clock className='h-3 w-3 mr-1' />
                {dueDate.formatted}
              </Badge>
            )}
          </div>

          {/* Bottom Row - Quick Actions & Stats */}
          <div className='flex items-center justify-between pt-1'>
            {/* Task Stats */}
            <div className='flex items-center gap-3 text-xs text-slate-500'>
              {(card?.comments?.length || 0) > 0 && (
                <span className='flex items-center gap-1 hover:text-slate-700'>
                  💬 {card.comments?.length}
                </span>
              )}
              {(card?.attachments?.length || 0) > 0 && (
                <span className='flex items-center gap-1 hover:text-slate-700'>
                  📎 {card.attachments?.length}
                </span>
              )}
            </div>

            {/* Quick Assign Popover */}
            <Popover
              open={isAssignPopoverOpen}
              onOpenChange={setIsAssignPopoverOpen}
            >
              <PopoverTrigger asChild>
                {assignedUser ? (
                  <button
                    className='flex items-center justify-center rounded-full transition-all hover:ring-2 hover:ring-slate-300 outline-none'
                    onClick={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    title={`Assignee: ${assignedUser.userName}`}
                  >
                    <Avatar className='h-6 w-6'>
                      <AvatarImage
                        src={getAvatarSrc(assignedUser.avatarUrl)}
                        alt={assignedUser.userName}
                      />
                      <AvatarFallback
                        className={`${getAvatarColorClass(assignedUser.userName)} text-[10px] text-white font-medium`}
                      >
                        {getAvatarFallback(assignedUser.userName)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                ) : (
                  <button
                    className='flex items-center justify-center h-6 w-6 rounded-full border border-dashed border-slate-300 text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors'
                    onClick={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    title='Unassigned'
                  >
                    <User className='h-3.5 w-3.5' />
                  </button>
                )}
              </PopoverTrigger>
              <PopoverContent
                className='p-2 w-64'
                align='end'
                onClick={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
              >
                <div className='space-y-1'>
                  <div className='px-2 py-1.5 text-xs font-semibold text-slate-700'>
                    Assign to
                  </div>

                  {/* Unassign */}
                  <button
                    className='w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-slate-100 rounded transition-colors text-left'
                    onClick={handleUnassign}
                  >
                    <div className='h-6 w-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center'>
                      <User className='h-3 w-3 text-slate-400' />
                    </div>
                    <span className='text-slate-600'>Unassigned</span>
                  </button>

                  {/* Assign to me */}
                  <button
                    className='w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-blue-50 rounded transition-colors text-left'
                    onClick={handleAssignToMe}
                  >
                    <div className='h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center'>
                      <CheckCircle2 className='h-3.5 w-3.5 text-white' />
                    </div>
                    <span className='text-blue-600 font-medium'>
                      Assign to me
                    </span>
                  </button>

                  <div className='h-px bg-slate-200 my-1' />

                  {/* Team members */}
                  <div className='max-h-48 overflow-y-auto space-y-0.5'>
                    {currentGroupMembers.map(member => (
                      <button
                        key={member.id}
                        className='w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-slate-100 rounded transition-colors text-left'
                        onClick={e =>
                          handleAssignToUser(
                            member.id,
                            member.userId ?? member.id,
                            e
                          )
                        }
                      >
                        <Avatar className='h-6 w-6'>
                          <AvatarImage
                            src={getAvatarSrc(member.avatarUrl)}
                            alt={member.userName}
                          />
                          <AvatarFallback
                            className={`${getAvatarColorClass(member.userName)} text-xs text-white font-medium`}
                          >
                            {getAvatarFallback(member.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                          <div className='text-sm text-slate-900 truncate'>
                            {member.userName}
                          </div>
                          <div className='text-xs text-slate-500 truncate'>
                            {member.userCode}
                          </div>
                        </div>
                        {(card.assignedTo === member.id ||
                          card.assignedTo === member.userId) && (
                          <CheckCircle2 className='h-4 w-4 text-blue-600 shrink-0' />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <CardDetailSheet
        card={card}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  )
}

export default TrelloCard
