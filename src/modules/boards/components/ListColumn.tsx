import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ColumnItem from './Column'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { Column } from '../types/board'

interface ListColumnProps {
  columns: Column[]
}

function ListColumn({ columns }: ListColumnProps) {
  return (
    <SortableContext
      items={columns?.map(c => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <div className='w-full h-full flex overflow-x-auto overflow-y-hidden'>
        {columns?.map(column => (
          <ColumnItem key={column._id} column={column} />
        ))}
        {/* Add new column button */}
        <div className='min-w-50 max-w-50 mx-4 rounded-lg h-fit bg-white/25'>
          <Button
            variant='ghost'
            className='text-white w-full justify-start pl-4 py-2 hover:bg-white/30'
          >
            <Plus className='mr-2 h-4 w-4' />
            Add new column
          </Button>
        </div>
      </div>
    </SortableContext>
  )
}

export default ListColumn
