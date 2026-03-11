import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Calendar, Code, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useGetGroupById } from '../hooks/useGroups'

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: group, isLoading, isError } = useGetGroupById(id || '')

  if (isLoading) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='h-12 w-12 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-slate-600'>Đang tải thông tin nhóm...</p>
        </div>
      </div>
    )
  }

  if (isError || !group) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-slate-900 mb-2'>
            Không tìm thấy nhóm
          </h2>
          <p className='text-slate-600 mb-6'>
            Nhóm này không tồn tại hoặc đã bị xóa
          </p>
          <Button onClick={() => navigate('/groups')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    )
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-slate-400'
  }

  return (
    <div className='flex-1 p-6'>
      {/* Header */}
      <div className='mb-6'>
        <Button
          variant='ghost'
          onClick={() => navigate('/groups')}
          className='mb-4'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Quay lại
        </Button>

        <div className='flex items-start justify-between'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <h1 className='text-3xl font-bold text-slate-900'>
                {group.name}
              </h1>
              <Badge>{group.category}</Badge>
            </div>
            <div className='flex items-center gap-4 text-sm text-slate-600'>
              <span className='flex items-center gap-1'>
                <Users className='h-4 w-4' />
                {group.memberCount} / {group.maxMembers} thành viên
              </span>
              {group.createdAt && (
                <span className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  {new Date(group.createdAt).toLocaleDateString('vi-VN')}
                </span>
              )}
              {group.inviteCode && (
                <span className='flex items-center gap-1'>
                  <Code className='h-4 w-4' />
                  Mã: <strong>{group.inviteCode}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className='bg-white rounded-lg border border-slate-200 p-6 mb-6'>
        <h2 className='text-lg font-semibold text-slate-900 mb-4'>
          Tiến độ dự án
        </h2>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-slate-600'>Hoàn thành</span>
            <span className='text-2xl font-bold text-slate-900'>
              {group.progress}%
            </span>
          </div>
          <Progress
            value={group.progress}
            className='h-3'
            indicatorClassName={getProgressColor(group.progress)}
          />
        </div>
      </div>

      {/* Placeholder for future features */}
      <div className='bg-slate-50 rounded-lg border border-slate-200 p-8 text-center'>
        <p className='text-slate-600'>
          🚧 Tính năng quản lý chi tiết nhóm đang được phát triển
        </p>
        <p className='text-sm text-slate-500 mt-2'>
          Sẽ bao gồm: Danh sách thành viên, Task board, File sharing, Chat...
        </p>
      </div>
    </div>
  )
}
