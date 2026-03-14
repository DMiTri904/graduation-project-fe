import { useState } from 'react'
import {
  AlertCircle,
  Clock,
  User,
  CheckSquare,
  ChevronDown,
  Flag,
  CheckCircle2,
  Circle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Card as CardType } from '../types/board'
import CardDetailSheet from './CardDetailSheet'
import { useBoardStore } from '../stores/useBoardStore'
import { mockTeamMembers, getCurrentUserId } from '~/apis/team-members'
import { formatIssueKey } from '~/utils/formatters'
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
  const { updateCard } = useBoardStore()

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

  // Format date helper
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const isOverdue = date < today

    return {
      formatted: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      isOverdue
    }
  }

  // Get priority configuration
  const priorityConfig = getPriorityConfig(card?.priority)

  // Get assignee initials
  const getInitials = (name?: string) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Handle Quick Assign
  const handleAssignToMe = (e: React.MouseEvent) => {
    e.stopPropagation()
    const currentUser = mockTeamMembers.find(m => m.id === getCurrentUserId())
    if (currentUser) {
      updateCard(card._id, { assignee: currentUser.name })
    }
    setIsAssignPopoverOpen(false)
  }

  const handleAssignToUser = (userName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    updateCard(card._id, { assignee: userName })
    setIsAssignPopoverOpen(false)
  }

  const handleUnassign = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateCard(card._id, { assignee: undefined })
    setIsAssignPopoverOpen(false)
  }

  // Handle Quick Priority Change
  const handlePriorityChange = (
    priority: PriorityLevel,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    updateCard(card._id, { priority })
    setIsPriorityDropdownOpen(false)
  }

  // Don't render placeholder cards at all
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

  const dueDate = formatDueDate(card?.dueDate)

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open detail if we're dragging
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

          {/* Bottom Row - Quick Actions */}
          <div className='flex items-center justify-between pt-1'>
            {/* Quick Assign Popover */}
            <Popover
              open={isAssignPopoverOpen}
              onOpenChange={setIsAssignPopoverOpen}
            >
              <PopoverTrigger asChild>
                {card?.assignee ? (
                  <button
                    className='flex items-center gap-2 hover:bg-slate-50 rounded px-1.5 py-1 -mx-1.5 transition-colors group'
                    onClick={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                  >
                    <Avatar className='h-6 w-6 ring-2 ring-white group-hover:ring-slate-200 transition-all'>
                      <AvatarFallback className='text-xs bg-blue-100 text-blue-700 font-medium'>
                        {getInitials(card.assignee)}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-xs text-slate-600 group-hover:text-slate-900'>
                      {card.assignee}
                    </span>
                  </button>
                ) : (
                  <button
                    className='flex items-center gap-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded px-1.5 py-1 -mx-1.5 transition-colors'
                    onClick={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                  >
                    <div className='h-6 w-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center'>
                      <User className='h-3 w-3' />
                    </div>
                    <span className='text-xs'>Unassigned</span>
                  </button>
                )}
              </PopoverTrigger>
              <PopoverContent
                className='p-2 w-64'
                align='start'
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
                    {mockTeamMembers.map(member => (
                      <button
                        key={member.id}
                        className='w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-slate-100 rounded transition-colors text-left'
                        onClick={e => handleAssignToUser(member.name, e)}
                      >
                        <Avatar className='h-6 w-6'>
                          <AvatarFallback className='text-xs bg-slate-200 text-slate-700'>
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                          <div className='text-sm text-slate-900 truncate'>
                            {member.name}
                          </div>
                          <div className='text-xs text-slate-500 truncate'>
                            {member.email}
                          </div>
                        </div>
                        {card.assignee === member.name && (
                          <CheckCircle2 className='h-4 w-4 text-blue-600 shrink-0' />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Task Stats */}
            <div className='flex items-center gap-2 text-xs text-slate-500'>
              {(card?.comments?.length || 0) > 0 && (
                <span className='flex items-center gap-1'>
                  💬 {card.comments?.length}
                </span>
              )}
              {(card?.attachments?.length || 0) > 0 && (
                <span className='flex items-center gap-1'>
                  📎 {card.attachments?.length}
                </span>
              )}
            </div>
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
