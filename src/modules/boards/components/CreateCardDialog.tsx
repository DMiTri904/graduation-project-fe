import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useBoardStore } from '../stores/useBoardStore'
import { createDetailedCardAPI } from '../api/board.api'

interface CreateCardDialogProps {
  trigger?: React.ReactNode
}

export default function CreateCardDialog({ trigger }: CreateCardDialogProps) {
  const { board, addCard } = useBoardStore()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [selectedColumnId, setSelectedColumnId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<
    'low' | 'medium' | 'high' | 'urgent'
  >('medium')
  const [assignee, setAssignee] = useState('')
  const [dueDate, setDueDate] = useState('')

  if (!board) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !selectedColumnId) return

    setIsLoading(true)
    try {
      const newCard = await createDetailedCardAPI(board._id, selectedColumnId, {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        assignee: assignee.trim() || undefined,
        dueDate: dueDate || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      addCard(selectedColumnId, newCard)

      // Reset form
      setTitle('')
      setDescription('')
      setPriority('medium')
      setAssignee('')
      setDueDate('')
      setSelectedColumnId('')
      setOpen(false)
    } catch (error) {
      console.error('Failed to create card:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset form when closing
      setTitle('')
      setDescription('')
      setPriority('medium')
      setAssignee('')
      setDueDate('')
      setSelectedColumnId('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size='sm'>
            <Plus className='h-4 w-4 mr-2' />
            Create Card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-131.25'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Card</DialogTitle>
            <DialogDescription>
              Add a new card to your board. Choose a column and fill in the
              details.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Column Select */}
            <div className='grid gap-2'>
              <Label htmlFor='column'>Column *</Label>
              <Select
                value={selectedColumnId}
                onValueChange={setSelectedColumnId}
                disabled={isLoading}
              >
                <SelectTrigger id='column'>
                  <SelectValue placeholder='Select a column' />
                </SelectTrigger>
                <SelectContent>
                  {board.columns.map(column => (
                    <SelectItem key={column._id} value={column._id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title Input */}
            <div className='grid gap-2'>
              <Label htmlFor='title'>Title *</Label>
              <Input
                id='title'
                placeholder='Enter card title...'
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Description Textarea */}
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                placeholder='Add a more detailed description...'
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={isLoading}
                rows={4}
              />
            </div>

            {/* Priority Select */}
            <div className='grid gap-2'>
              <Label htmlFor='priority'>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value: string) =>
                  setPriority(value as 'low' | 'medium' | 'high' | 'urgent')
                }
                disabled={isLoading}
              >
                <SelectTrigger id='priority'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>🔽 Low</SelectItem>
                  <SelectItem value='medium'>➖ Medium</SelectItem>
                  <SelectItem value='high'>🔼 High</SelectItem>
                  <SelectItem value='urgent'>🔴 Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignee Input */}
            <div className='grid gap-2'>
              <Label htmlFor='assignee'>Assignee</Label>
              <Input
                id='assignee'
                placeholder='Enter assignee name...'
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Due Date Input */}
            <div className='grid gap-2'>
              <Label htmlFor='dueDate'>Due Date</Label>
              <Input
                id='dueDate'
                type='date'
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={!title.trim() || !selectedColumnId || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
