import { Users, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { ClassGroup } from '../types/class'

interface GroupCardProps {
  group: ClassGroup
  onClick: () => void
}

export default function GroupCard({ group, onClick }: GroupCardProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-slate-400'
  }

  return (
    <Card
      className='hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-blue-200'
      onClick={onClick}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between mb-2'>
          <Badge variant='secondary' className='text-xs'>
            Nhóm {group.id.split('-')[1]}
          </Badge>
          <TrendingUp
            className={`h-4 w-4 ${
              group.progress >= 50 ? 'text-green-500' : 'text-slate-400'
            }`}
          />
        </div>
        <CardTitle className='text-lg group-hover:text-blue-600 transition-colors'>
          {group.name}
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Members Count */}
        <div className='flex items-center gap-2 text-sm text-slate-600'>
          <Users className='h-4 w-4' />
          <span className='font-medium'>
            {group.memberCount} / {group.maxMembers} thành viên
          </span>
          {group.memberCount === group.maxMembers && (
            <Badge variant='outline' className='ml-auto text-xs'>
              Đầy đủ
            </Badge>
          )}
        </div>

        {/* Progress Section */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-slate-600 font-medium'>Tiến độ dự án</span>
            <span className='font-bold text-slate-900'>{group.progress}%</span>
          </div>
          <Progress
            value={group.progress}
            className='h-2'
            indicatorClassName={getProgressColor(group.progress)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
