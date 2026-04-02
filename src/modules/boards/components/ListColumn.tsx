import ColumnItem from './Column'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import type { Column } from '../types/board'

interface ListColumnProps {
  columns: Column[]
}

function ListColumn({ columns }: ListColumnProps) {
  return (
    <SortableContext
      items={columns?.map(c => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <div className='grid w-full grid-cols-4 gap-4 min-w-0'>
        {columns?.map(column => (
          <ColumnItem key={column._id} column={column} />
        ))}
      </div>
    </SortableContext>
  )
}

export default ListColumn
