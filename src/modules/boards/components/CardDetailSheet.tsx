import { useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
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
import type { Card } from '../types/board'
import { useDeleteTask, useUpdateTask } from '../hooks/useBoardTasks'
import { getPriorityConfig, PRIORITY_OPTIONS } from '~/utils/priority'
import { toast } from 'sonner'
import { formatDueDateForSubmit } from '@/utils/boardFormatters'
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

interface EditTaskFormState {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assignee: string
  dueDate: string
}

export default function CardDetailSheet({
  card,
  isOpen,
  onClose
}: CardDetailSheetProps) {
  const { updateCard, deleteCard, board, currentGroupMembers } = useBoardStore()

  const taskId = useMemo(() => {
    const id = Number(String(card?._id || '').replace(/\D/g, ''))
    return Number.isFinite(id) && id > 0 ? id : 0
  }, [card?._id])

  const groupId = useMemo(() => {
    const id = Number(String(card?.boardId || '').replace(/\D/g, ''))
    return Number.isFinite(id) && id > 0 ? id : 0
  }, [card?.boardId])

  const { mutateAsync: updateTaskMutateAsync, isPending: isUpdatingTask } =
    useUpdateTask(groupId)
  const { mutateAsync: deleteTaskMutateAsync } = useDeleteTask(groupId)

  const [editForm, setEditForm] = useState<EditTaskFormState>({
    title: '',
    description: '',
    priority: 'medium',
    assignee: 'unassigned',
    dueDate: ''
  })
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const toInputDate = (dateValue?: string) => {
    if (!dateValue) return ''
    const parsedDate = new Date(dateValue)
    if (Number.isNaN(parsedDate.getTime())) {
      return ''
    }

    const year = parsedDate.getFullYear()
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
    const day = String(parsedDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const mapPriorityToApi = (
    value: 'low' | 'medium' | 'high'
  ): 'Low' | 'Medium' | 'High' => {
    if (value === 'high') return 'High'
    if (value === 'low') return 'Low'
    return 'Medium'
  }

  const mapColumnTitleToTaskStatus = (
    value?: string
  ): 'ToDo' | 'InProgress' | 'Test' | 'Done' => {
    const normalized = (value || '').replace(/\s+/g, '').toLowerCase()

    if (normalized === 'done') return 'Done'
    if (normalized === 'test' || normalized === 'testing') return 'Test'
    if (normalized === 'inprogress' || normalized === 'in_progress') {
      return 'InProgress'
    }

    return 'ToDo'
  }

  useEffect(() => {
    if (!card) return

    const matchedMember = currentGroupMembers.find(
      member =>
        member.id === card.assignedTo || member.userId === card.assignedTo
    )

    setEditForm({
      title: card.title || '',
      description: card.description || '',
      priority: card.priority || 'medium',
      assignee: matchedMember
        ? String(matchedMember.id)
        : typeof card.assignedTo === 'number' && card.assignedTo > 0
          ? String(card.assignedTo)
          : 'unassigned',
      dueDate: toInputDate(card.dueDate)
    })
  }, [card, currentGroupMembers])

  if (!card || !board) return null

  const column = board.columns.find(col => col._id === card.columnId)

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Not set'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
    setEditForm(prev => ({
      ...prev,
      title: prev.title.trim() || card.title || ''
    }))
  }

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleBlur()
    }
    if (e.key === 'Escape') {
      setEditForm(prev => ({ ...prev, title: card.title || '' }))
      setIsEditingTitle(false)
    }
  }

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false)
  }

  const handlePriorityChange = (newPriority: string) => {
    setEditForm(prev => ({
      ...prev,
      priority: newPriority as 'low' | 'medium' | 'high'
    }))
  }

  const handleAssigneeChange = (newAssigneeValue: string) => {
    setEditForm(prev => ({ ...prev, assignee: newAssigneeValue }))
  }

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({ ...prev, dueDate: e.target.value }))
  }

  const handleUpdateTask = async () => {
    if (taskId <= 0 || groupId <= 0) {
      console.error('Invalid task id/group id for update task API')
      return
    }

    const assignedToNumber =
      editForm.assignee === 'unassigned' ? 0 : Number(editForm.assignee)

    const dueDateIso = formatDueDateForSubmit(editForm.dueDate) ?? null

    const payload = {
      title: editForm.title.trim() || card.title || '',
      description: editForm.description || '',
      priority: mapPriorityToApi(editForm.priority),
      taskStatus: mapColumnTitleToTaskStatus(column?.title),
      assignedTo:
        Number.isFinite(assignedToNumber) && assignedToNumber > 0
          ? assignedToNumber
          : 0,
      dueDate: dueDateIso
    }

    try {
      await updateTaskMutateAsync({ taskId, body: payload })

      const selectedMember = currentGroupMembers.find(
        member => String(member.id) === editForm.assignee
      )

      updateCard(card._id, {
        title: payload.title,
        description: payload.description,
        priority: editForm.priority,
        assignedTo:
          editForm.assignee === 'unassigned'
            ? null
            : (selectedMember?.userId ??
              selectedMember?.id ??
              assignedToNumber),
        dueDate: payload.dueDate ?? undefined
      })

      toast.success('Cập nhật công việc thành công')
      onClose()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDelete = async () => {
    if (taskId <= 0 || groupId <= 0) {
      console.error('Invalid task id/group id for delete task API')
      return
    }

    try {
      await deleteTaskMutateAsync({ taskId })
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
          <div className='sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10'>
            <div className='flex items-center gap-3 flex-1'>
              <ListTodo className='h-5 w-5 text-slate-600' />
              {isEditingTitle ? (
                <Input
                  value={editForm.title}
                  onChange={e =>
                    setEditForm(prev => ({ ...prev, title: e.target.value }))
                  }
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
                  {editForm.title || 'Untitled'}
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

          <div className='px-6 py-6'>
            <div className='grid grid-cols-3 gap-6'>
              <div className='col-span-2 space-y-6'>
                <div>
                  <Label className='text-sm font-semibold mb-2 flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4' />
                    Description
                  </Label>
                  {isEditingDescription ? (
                    <Textarea
                      value={editForm.description}
                      onChange={e =>
                        setEditForm(prev => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }
                      onBlur={handleDescriptionBlur}
                      placeholder='Add a more detailed description...'
                      autoFocus
                      rows={8}
                      className='resize-none border-2 border-blue-500 mt-2'
                    />
                  ) : (
                    <div
                      onClick={() => setIsEditingDescription(true)}
                      className='min-h-30 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors text-sm mt-2 whitespace-pre-wrap'
                    >
                      {editForm.description || (
                        <span className='text-slate-400'>
                          Add a more detailed description...
                        </span>
                      )}
                    </div>
                  )}
                </div>

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

              <div className='space-y-6'>
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

                <div>
                  <Label className='text-xs font-semibold text-slate-600 uppercase mb-2 flex items-center gap-1'>
                    <Flag className='h-3 w-3' />
                    Priority
                  </Label>
                  <Select
                    value={editForm.priority}
                    onValueChange={handlePriorityChange}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue>
                        <div className='flex items-center gap-2'>
                          {getPriorityConfig(editForm.priority).icon}
                          <span className='capitalize'>
                            {editForm.priority}
                          </span>
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

                <div>
                  <Label className='text-xs font-semibold text-slate-600 uppercase mb-2 flex items-center gap-1'>
                    <User className='h-3 w-3' />
                    Assignee
                  </Label>
                  <Input type='hidden' value={editForm.assignee} readOnly />
                  <Select
                    value={editForm.assignee}
                    onValueChange={handleAssigneeChange}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Unassigned' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='unassigned'>Unassigned</SelectItem>
                      {currentGroupMembers.map(member => (
                        <SelectItem key={member.id} value={String(member.id)}>
                          <div className='flex items-center gap-2 min-w-0'>
                            <span className='truncate'>{member.userName}</span>
                            <span className='text-xs text-slate-500 truncate'>
                              {member.userCode}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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

                <div>
                  <Label className='text-xs font-semibold text-slate-600 uppercase mb-2 flex items-center gap-1'>
                    <Calendar className='h-3 w-3' />
                    Due Date
                  </Label>
                  <Input
                    type='date'
                    value={editForm.dueDate}
                    onChange={handleDueDateChange}
                    className='text-sm'
                  />
                </div>

                <div className='pt-4 border-t'>
                  <Label className='text-xs font-semibold text-slate-600 uppercase mb-3 block'>
                    Actions
                  </Label>
                  <Button
                    variant='default'
                    size='sm'
                    onClick={handleUpdateTask}
                    className='w-full justify-start mb-2 bg-blue-600 hover:bg-blue-700'
                    disabled={isUpdatingTask}
                  >
                    {isUpdatingTask ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => setShowDeleteDialog(true)}
                    className='w-full justify-start'
                    disabled={isUpdatingTask}
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Xóa công việc
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn xóa công việc?</AlertDialogTitle>
            <AlertDialogDescription>
              Công việc "{card.title}" sẽ bị xóa vĩnh viễn và không thể khôi
              phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
