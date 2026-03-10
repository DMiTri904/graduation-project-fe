import { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CheckSquare, Calendar, User, CornerDownLeft, X } from 'lucide-react'
import { useBoardStore } from '../stores/useBoardStore'
import { createCardAPI } from '../api/board.api'

interface InlineCreateCardFormProps {
  columnId: string
  boardId: string
  onCancel: () => void
}

export default function InlineCreateCardForm({
  columnId,
  boardId,
  onCancel
}: InlineCreateCardFormProps) {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const { addCard } = useBoardStore()

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        if (!isLoading) {
          onCancel()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isLoading, onCancel])

  const handleSubmit = async () => {
    if (!title.trim() || isLoading) return

    setIsLoading(true)
    try {
      const newCard = await createCardAPI(columnId, title.trim(), boardId)
      addCard(columnId, newCard)
      setTitle('')
      textareaRef.current?.focus()
    } catch (error) {
      console.error('Failed to create card:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div ref={formRef} className='p-2'>
      {/* Form Container with Blue Border (JIRA Style) */}
      <div className='border-2 border-blue-500 rounded-md bg-white shadow-sm'>
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='What needs to be done?'
          disabled={isLoading}
          rows={2}
          className='border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-sm'
        />

        {/* Toolbar */}
        <div className='flex items-center justify-between px-3 py-2 border-t border-slate-200'>
          {/* Left Side - Action Buttons */}
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 text-slate-500 hover:text-slate-700'
              disabled={isLoading}
            >
              <CheckSquare className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 text-slate-500 hover:text-slate-700'
              disabled={isLoading}
            >
              <Calendar className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 text-slate-500 hover:text-slate-700'
              disabled={isLoading}
            >
              <User className='h-4 w-4' />
            </Button>
          </div>

          {/* Right Side - Submit & Cancel */}
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              onClick={onCancel}
              disabled={isLoading}
              className='h-7 w-7 text-slate-500 hover:text-slate-700'
            >
              <X className='h-4 w-4' />
            </Button>
            <Button
              size='icon'
              onClick={handleSubmit}
              disabled={!title.trim() || isLoading}
              className='h-7 w-7 bg-blue-600 hover:bg-blue-700'
            >
              <CornerDownLeft className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
