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
import { useDeleteTask, useUpdateTask } from '../hooks/useBoardHooks'
import TaskCommentSection from '@/modules/comments/components/TaskCommentSection'
import { getPriorityConfig, PRIORITY_OPTIONS } from '~/utils/priority'
import { toast } from 'sonner'
import { formatDueDateForSubmit } from '@/utils/boardFormatters'
import {
  Trash2,
  User,
  Calendar,
  Flag,
  Loader2,
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

  const activeGroupMembers = useMemo(
    () => currentGroupMembers.filter(member => member.isActive !== false),
    [currentGroupMembers]
  )

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

    const matchedMember = activeGroupMembers.find(
      member =>
        member.id === card.assignedTo || member.userId === card.assignedTo
    )

    setEditForm({
      title: card.title || '',
      description: card.description || '',
      priority: card.priority || 'medium',
      assignee: matchedMember ? String(matchedMember.id) : 'unassigned',
      dueDate: toInputDate(card.dueDate)
    })
  }, [card, activeGroupMembers])

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

      const selectedMember = activeGroupMembers.find(
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
        <SheetContent className='sm:max-w-4xl xl:max-w-5xl overflow-y-auto p-0'>
          {/* Sticky header */}
          <div className='sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10'>
            <div className='flex items-center gap-3 flex-1'>
              <ListTodo className='h-5 w-5 text-slate-500' />
              {isEditingTitle ? (
                <Input
                  value={editForm.title}
                  onChange={e =>
                    setEditForm(prev => ({ ...prev, title: e.target.value }))
                  }
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  autoFocus
                  className='text-lg font-semibold border-2 border-blue-500 flex-1'
                />
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className='text-lg font-semibold cursor-pointer hover:bg-slate-100 rounded px-2 py-1 -ml-2 transition-colors flex-1'
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
              {/* Left: main content */}
              <div className='col-span-2 space-y-5'>
                {/* Description */}
                <div>
                  <Label className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block'>
                    Mô tả
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
                      placeholder='Thêm mô tả chi tiết...'
                      autoFocus
                      rows={6}
                      className='resize-none border-2 border-blue-500'
                    />
                  ) : (
                    <div
                      onClick={() => setIsEditingDescription(true)}
                      className='min-h-20 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors text-sm whitespace-pre-wrap'
                    >
                      {editForm.description || (
                        <span className='text-slate-400'>
                          Thêm mô tả chi tiết...
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Activity meta — compact */}
                <div className='flex items-center gap-4 text-xs text-slate-400 py-2 border-t border-slate-100'>
                  {card.createdAt && (
                    <span>Tạo: {formatDate(card.createdAt)}</span>
                  )}
                  {card.updatedAt && (
                    <span>Cập nhật: {formatDate(card.updatedAt)}</span>
                  )}
                  {/* <span className='flex items-center gap-1'>
                    <MessageSquare className='h-3 w-3' />
                    {card.comments?.length || 0}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Paperclip className='h-3 w-3' />
                    {card.attachments?.length || 0}
                  </span> */}
                </div>

                {/* Comments */}
                {taskId > 0 && <TaskCommentSection taskId={taskId} />}
              </div>

              {/* Right: sidebar */}
              <div className='space-y-5'>
                {/* Status */}
                <div>
                  <Label className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block'>
                    Trạng thái
                  </Label>
                  {column && (
                    <Badge variant='secondary' className='text-xs'>
                      {column.title}
                    </Badge>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <Label className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1'>
                    <Flag className='h-3 w-3' />
                    Ưu tiên
                  </Label>
                  <Select
                    value={editForm.priority}
                    onValueChange={handlePriorityChange}
                  >
                    <SelectTrigger className='w-full h-8 text-sm'>
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

                {/* Assignee */}
                <div>
                  <Label className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1'>
                    <User className='h-3 w-3' />
                    Người thực hiện
                  </Label>
                  <Select
                    value={editForm.assignee}
                    onValueChange={handleAssigneeChange}
                  >
                    <SelectTrigger className='w-full h-8 text-sm'>
                      <SelectValue placeholder='Chưa phân công' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='unassigned'>Chưa phân công</SelectItem>
                      {activeGroupMembers.map(member => (
                        <SelectItem key={member.id} value={String(member.id)}>
                          <div className='flex items-center gap-2 min-w-0'>
                            <span className='truncate'>{member.userName}</span>
                            <span className='text-xs text-slate-400 truncate'>
                              {member.userCode}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reporter */}
                {card.reporter && (
                  <div>
                    <Label className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1'>
                      <User className='h-3 w-3' />
                      Người báo cáo
                    </Label>
                    <div className='text-sm text-slate-700 px-3 py-2 bg-slate-50 rounded-md border border-slate-200'>
                      {card.reporter}
                    </div>
                  </div>
                )}

                {/* Due date */}
                <div>
                  <Label className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1'>
                    <Calendar className='h-3 w-3' />
                    Hạn hoàn thành
                  </Label>
                  <Input
                    type='date'
                    value={editForm.dueDate}
                    onChange={handleDueDateChange}
                    className='h-8 text-sm'
                  />
                </div>

                {/* Actions */}
                <div className='pt-4 border-t border-slate-100 space-y-2'>
                  <Button
                    variant='default'
                    size='sm'
                    onClick={handleUpdateTask}
                    className='w-full h-8 text-sm bg-blue-600 hover:bg-blue-700'
                    disabled={isUpdatingTask}
                  >
                    {isUpdatingTask ? (
                      <>
                        <Loader2 className='h-3.5 w-3.5 mr-2 animate-spin' />
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu thay đổi'
                    )}
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => setShowDeleteDialog(true)}
                    className='w-full h-8 text-sm'
                    disabled={isUpdatingTask}
                  >
                    <Trash2 className='h-3.5 w-3.5 mr-2' />
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
