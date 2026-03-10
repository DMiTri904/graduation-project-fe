import { Filter, ArrowUpDown, MoreHorizontal, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import CreateCardDialog from './CreateCardDialog'
import type { Board } from '../types/board'

interface BoardBarProps {
  board?: Board
}

export default function BoardBar({ board }: BoardBarProps) {
  const groupMembers = [
    {
      name: 'Homa',
      src: 'https://i.pinimg.com/736x/80/4d/73/804d73986dee8ae72e7480b56c95ca66.jpg'
    },
    {
      name: 'Minh',
      src: 'https://assets.goal.com/images/v3/blte301dc4690b11599/kvaratskhelia_napoli_(1).jpg'
    },
    {
      name: 'Tri',
      src: 'https://cdn.tuoitre.vn/471584752817336320/2023/2/14/thoi-the-thay-doi-mbappe-ra-dieu-kien-cuc-kho-de-o-lai-psg-236322-2045-1676347173240951828485.jpg'
    }
  ]
  const remainUsers = 2

  return (
    // Tăng chiều cao lên một chút (h-[68px]) và chốt viền border-slate-200 thật mờ
    <div className='w-full h-17 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0'>
      {/* KHU VỰC BÊN TRÁI */}
      <div className='flex items-center gap-5'>
        {/* Tiêu đề dự án: Chữ to hơn (text-xl), màu đậm hơn (text-slate-900) */}
        <h1 className='text-xl font-bold text-slate-900 tracking-tight'>
          {board?.title || 'Web Development Project - Group 04'}
        </h1>

        {/* Dải Avatar: Tăng kích thước từ h-7 lên h-8 để dễ nhìn hơn */}
        <div className='flex items-center -space-x-2'>
          {groupMembers.map((user, index) => (
            <Avatar
              key={index}
              className='h-8 w-8 border-2 border-white cursor-pointer hover:z-10 hover:scale-105 transition-all shadow-sm'
            >
              <AvatarImage
                src={user.src}
                alt={user.name}
                className='object-cover'
              />
              <AvatarFallback className='bg-[#A3B899] text-white text-[10px]'>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          <div className='h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center z-10 text-xs font-semibold text-slate-600 cursor-pointer hover:bg-slate-200 shadow-sm'>
            +{remainUsers}
          </div>
        </div>

        {/* Nút Invite: Tăng chiều cao lên h-9 để cân đối với Avatar */}
        <Button className='h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 font-medium shadow-sm'>
          <UserPlus className='mr-2 h-4 w-4' />
          Invite
        </Button>
      </div>

      {/* KHU VỰC BÊN PHẢI */}
      <div className='flex items-center gap-2.5'>
        {/* Create Card Button */}
        <CreateCardDialog />

        <Button
          variant='outline'
          className='h-9 text-slate-600 border-slate-200 hover:bg-slate-50 font-medium shadow-sm'
        >
          <Filter className='mr-2 h-4 w-4 text-slate-500' />
          Filters
        </Button>

        <Button
          variant='outline'
          className='h-9 text-slate-600 border-slate-200 hover:bg-slate-50 font-medium shadow-sm'
        >
          <ArrowUpDown className='mr-2 h-4 w-4 text-slate-500' />
          Sort
        </Button>

        <Button
          variant='outline'
          size='icon'
          className='h-9 w-9 text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'
        >
          <MoreHorizontal className='h-4 w-4 text-slate-500' />
        </Button>
      </div>
    </div>
  )
}
