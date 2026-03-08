import {
  Plus,
  MoreHorizontal,
  Scissors,
  Copy,
  Clipboard,
  Trash2,
  Archive,
  GripVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import ListCards from './ListCards'
import { mapOrder } from '~/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Column as ColumnType } from '../types/board'

interface ColumnProps {
  column: ColumnType
}

function Column({ column }: ColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <div
        {...listeners}
        className='min-w-75 max-w-75 bg-slate-100 dark:bg-slate-800 ml-4 rounded-lg h-fit max-h-[calc(100vh-170px)]'
      >
        {/* Column Header */}
        <div className='h-12.5 p-4 flex items-center justify-between'>
          <h3 className='text-base font-bold cursor-pointer'>{column.title}</h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <Plus className='mr-2 h-4 w-4' />
                Add new card
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Scissors className='mr-2 h-4 w-4' />
                Cut
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className='mr-2 h-4 w-4' />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clipboard className='mr-2 h-4 w-4' />
                Paste
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-red-600'>
                <Trash2 className='mr-2 h-4 w-4' />
                Remove this column
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className='mr-2 h-4 w-4' />
                Archive this column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* List Cards */}
        <ListCards cards={orderedCards} />

        {/* Column Footer */}
        <div className='h-12.5 p-4 flex items-center justify-between'>
          <Button variant='ghost' size='sm' className='h-8'>
            <Plus className='mr-2 h-4 w-4' />
            Add new card
          </Button>
          <GripVertical className='h-5 w-5 cursor-pointer text-slate-500' />
        </div>
      </div>
    </div>
  )
}

export default Column
