import { useState, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useBoardStore } from '../stores/useBoardStore'
import { updateCardAPI, deleteCardAPI } from '../api/board.api'
import type { Card } from '../types/board'
import { getPriorityConfig, PRIORITY_OPTIONS } from '~/utils/priority'
import {
  Trash2,
  User,
  Calendar,
  Flag,
  Clock,
  MessageSquare,
  Paperclip,
  ListTodo,
  X
} from 'lucide-react'

interface CardDetailSheetProps {
  card: Card | null
  isOpen: boolean
  onClose: () => void
}

export default function CardDetailSheet({
  card,
  isOpen,
  onClose
}: CardDetailSheetProps) {
  const { updateCard, deleteCard, board } = useBoardStore()

  // Local state for editing
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<
    'low' | 'medium' | 'high' | 'urgent'
  >('medium')
  const [assignee, setAssignee] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Initialize local state when card changes
  useEffect(() => {
    if (card) {
      setTitle(card.title || '')
      setDescription(card.description || '')
      setPriority(card.priority || 'medium')
      setAssignee(card.assignee || '')
      setDueDate(card.dueDate || '')
    }
  }, [card])

  if (!card || !board) return null

  // Find the column this card belongs to
  const column = board.columns.find(col => col._id === card.columnId)

  // Format date for display
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Not set'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Handle title update
  const handleTitleBlur = async () => {
    setIsEditingTitle(false)
    if (title.trim() !== card.title && title.trim() !== '') {
      try {
        await updateCardAPI(card._id, { title: title.trim() })
        updateCard(card._id, { title: title.trim() })
      } catch (error) {
        console.error('Failed to update title:', error)
        setTitle(card.title || '')
      }
    } else {
      setTitle(card.title || '')
    }
  }

  // Handle Enter key on title
  const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleBlur()
    }
    if (e.key === 'Escape') {
      setTitle(card.title || '')
      setIsEditingTitle(false)
    }
  }

  // Handle description update
  const handleDescriptionBlur = async () => {
    setIsEditingDescription(false)
    if (description !== card.description) {
      try {
        await updateCardAPI(card._id, { description })
        updateCard(card._id, { description })
      } catch (error) {
        console.error('Failed to update description:', error)
        setDescription(card.description || '')
      }
    }
  }

  // Handle priority change
  const handlePriorityChange = async (newPriority: string) => {
    const priorityValue = newPriority as 'low' | 'medium' | 'high' | 'urgent'
    setPriority(priorityValue)
    try {
      await updateCardAPI(card._id, { priority: priorityValue })
      updateCard(card._id, { priority: priorityValue })
    } catch (error) {
      console.error('Failed to update priority:', error)
    }
  }

  // Handle assignee change
  const handleAssigneeBlur = async () => {
    if (assignee !== card.assignee) {
      try {
        await updateCardAPI(card._id, { assignee })
        updateCard(card._id, { assignee })
      } catch (error) {
        console.error('Failed to update assignee:', error)
        setAssignee(card.assignee || '')
      }
    }
  }

  // Handle due date change
  const handleDueDateChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDate = e.target.value
    setDueDate(newDate)
    try {
      await updateCardAPI(card._id, { dueDate: newDate })
      updateCard(card._id, { dueDate: newDate })
    } catch (error) {
      console.error('Failed to update due date:', error)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteCardAPI(card._id)
      deleteCard(card._id)
      setShowDeleteDialog(false)
      onClose()
    } catch (error) {
      console.error('Failed to delete card:', error)
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='sm:max-w-3xl overflow-y-auto p-0'>
          {/* Header */}
          <div className='sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10'>
            <div className='flex items-center gap-3 flex-1'>
              <ListTodo className='h-5 w-5 text-slate-600' />
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  autoFocus
                  className='text-xl font-semibold border-2 border-blue-500 flex-1'
                />
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className='text-xl font-semibold cursor-pointer hover:bg-slate-100 rounded px-2 py-1 -ml-2 transition-colors flex-1'
                >
                  {card.title || 'Untitled'}
                </h2>
              )}
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={onClose}
              className='h-8 w-8 p-0'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>

          {/* Main Content */}
          <div className='px-6 py-6'>
            <div className='grid grid-cols-3 gap-6'>
              {/* Left Column - Main Content */}
              <div className='col-span-2 space-y-6'>
                {/* Description Section */}
                <div>
                  <Label className='text-sm font-semibold mb-2 flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4' />
                    Description
                  </Label>
                  {isEditingDescription ? (
                    <Textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      onBlur={handleDescriptionBlur}
                      placeholder='Add a more detailed description...'
                      autoFocus
                      rows={8}
                      className='resize-none border-2 border-blue-500 mt-2'
                    />
                  ) : (
                    <div
                      onClick={() => setIsEditingDescription(true)}
                      className='min-h-[120px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors text-sm mt-2 whitespace-pre-wrap'
                    >
                      {card.description || (
                        <span className='text-slate-400'>
                          Add a more detailed description...
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Activity Section */}
                <div>
                  <Label className='text-sm font-semibold mb-3 flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    Activity
                  </Label>
                  <div className='space-y-3 mt-2'>
                    {card.createdAt && (
                      <div className='text-sm text-slate-600'>
                        <span className='font-medium'>Created:</span>{' '}
                        {formatDate(card.createdAt)}
                      </div>
                    )}
                    {card.updatedAt && (
                      <div className='text-sm text-slate-600'>
                        <span className='font-medium'>Last updated:</span>{' '}
                        {formatDate(card.updatedAt)}
                      </div>
                    )}
                    <div className='flex items-center gap-4 text-sm text-slate-600 pt-2 border-t'>
                      <div className='flex items-center gap-2'>
                        <MessageSquare className='h-4 w-4' />
                        <span>{card.comments?.length || 0} Comments</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Paperclip className='h-4 w-4' />
                        <span>{card.attachments?.length || 0} Attachments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className='space-y-6'>
                {/* Status */}
                <div>
                  <Label className='text-xs font-semibold text-slate-600 uppercase mb-2 block'>
                    Status
                  </Label>
                  {column && (
                    <Badge variant='secondary' className='text-sm'>
                      {column.title}
                    </Badge>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <Label className='text-xs font-semibold text-slate-600 uppercase mb-2 flex items-center gap-1'>
                    <Flag className='h-3 w-3' />
                    Priority
                  </Label>
                  <Select value={priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className='w-full'>
                      <SelectValue>
                        <div className='flex items-center gap-2'>
                          {getPriorityConfig(priority).icon}
                          <span className='capitalize'>{priority}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map(option => {
                        const config = getPriorityConfig(option.value)
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className='flex items-center gap-2'>
                              {config.icon}
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee */}
                <div>
                  <Label className='text-xs font-semibold text-slate-600 uppercase mb-2 flex items-center gap-1'>
                    <User className='h-3 w-3' />
                    Assignee
                  </Label>
                  <Input
                    value={assignee}
                    onChange={e => setAssignee(e.target.value)}
                    onBlur={handleAssigneeBlur}
                    placeholder='Unassigned'
                    className='text-sm'
                  />
                </div>

                {/* Reporter */}
                {card.reporter && (
                  <div>
                    <Label className='text-xs font-semibold text-slate-600 uppercase mb-2 flex items-center gap-1'>
                      <User className='h-3 w-3' />
                      Reporter
                    </Label>
                    <div className='text-sm text-slate-700 px-3 py-2 bg-slate-50 rounded-md'>
                      {card.reporter}
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div>
                  <Label className='text-xs font-semibold text-slate-600 uppercase mb-2 flex items-center gap-1'>
                    <Calendar className='h-3 w-3' />
                    Due Date
                  </Label>
                  <Input
                    type='date'
                    value={dueDate}
                    onChange={handleDueDateChange}
                    className='text-sm'
                  />
                </div>

                {/* Actions */}
                <div className='pt-4 border-t'>
                  <Label className='text-xs font-semibold text-slate-600 uppercase mb-3 block'>
                    Actions
                  </Label>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => setShowDeleteDialog(true)}
                    className='w-full justify-start'
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Delete Task
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{card.title}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
