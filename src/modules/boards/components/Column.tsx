import {
  Plus,
  MoreHorizontal,
  Scissors,
  Copy,
  Clipboard,
  Trash2,
  Archive
  // GripVertical // Có thể dùng nếu bạn muốn làm icon riêng để kéo cột
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
import AddCardInline from './AddCardInline'
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
    // Fix chiều cao: Dùng 100% thay vì h-full để dnd-kit tính toán chính xác hơn
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  return (
    <div
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
      className='h-full' // Wrapper ngoài cùng
    >
      {/* BỎ {...listeners} Ở ĐÂY ĐI. 
        Thêm max-h-full để cột không bao giờ cao vượt quá Container cha.
      */}
      <div className='min-w-75 max-w-75 bg-slate-100 dark:bg-slate-800 rounded-lg max-h-full flex flex-col'>
        {/* Column Header - Fixed 
            CHUYỂN {...listeners} VÀO ĐÂY: Chỉ khi user nắm vào Header mới cho kéo Cột đi.
        */}
        <div
          {...listeners}
          className='shrink-0 h-12.5 p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing'
        >
          <h3 className='text-base font-bold'>{column.title}</h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* onPointerDown stopPropagation để khi click mở Menu không bị dnd-kit nhầm là đang kéo cột */}
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onPointerDown={e => e.stopPropagation()}
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <Plus className='mr-2 h-4 w-4' />
                Add new card
              </DropdownMenuItem>
              {/* ... Các menu item khác giữ nguyên ... */}
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-red-600'>
                <Trash2 className='mr-2 h-4 w-4' />
                Remove this column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* VÙNG CHỨA LIST CARD CẦN PHẢI CUỘN - MAGIC LÀ Ở ĐÂY */}
        {/* flex-1: Chiếm phần diện tích còn lại. min-h-0: Ngăn thẻ div tự phình to. overflow-y-auto: Hiển thị thanh cuộn */}
        <div className='flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2'>
          <ListCards cards={orderedCards} />
        </div>

        {/* Column Footer - Fixed at bottom */}
        <div className='shrink-0 p-2 border-t border-slate-200 dark:border-slate-700'>
          <AddCardInline columnId={column._id} boardId={column.boardId} />
        </div>
      </div>
    </div>
  )
}

export default Column
