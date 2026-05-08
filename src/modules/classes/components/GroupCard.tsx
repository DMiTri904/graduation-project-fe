import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import React from 'react'

interface GroupCardProps {
  group: any
  onClick?: () => void
  actionButton?: React.ReactNode
  maxMembersPerGroup?: number
  isMyGroup?: boolean
  onJoin?: () => void
  isJoinDisabled?: boolean
}

export default function GroupCard({
  group,
  onClick,
  actionButton,
  maxMembersPerGroup,
  isMyGroup,
  onJoin,
  isJoinDisabled
}: GroupCardProps) {
  const computeProgressPercent = (
    progressData:
      | { totalTasks?: number; doneTasks?: number }
      | number
      | undefined
      | null
  ) => {
    if (progressData === null || progressData === undefined) return null

    if (typeof progressData === 'number') {
      if (!Number.isFinite(progressData)) return 0
      const normalized = Math.floor(progressData)
      return Math.min(100, Math.max(0, normalized))
    }

    const totalTasks = Number(progressData?.totalTasks ?? 0)
    const doneTasks = Number(progressData?.doneTasks ?? 0)

    if (!Number.isFinite(totalTasks) || totalTasks <= 0) return 0
    if (!Number.isFinite(doneTasks) || doneTasks <= 0) return 0

    return Math.floor((doneTasks / totalTasks) * 100)
  }

  const progress = computeProgressPercent(group.progress)
  const hasProgress = progress !== null

  const memberCount =
    typeof group.memberCount === 'number'
      ? group.memberCount
      : typeof group.totalMemberCount === 'number'
        ? group.totalMemberCount
        : 0
  const memberLimit =
    typeof maxMembersPerGroup === 'number' && maxMembersPerGroup > 0
      ? maxMembersPerGroup
      : typeof group.limitedUser === 'number'
        ? group.limitedUser
        : 0
  const isFull = memberLimit > 0 && memberCount === memberLimit

  const getProgressColor = (progressValue: number) => {
    if (progressValue >= 75) return 'bg-green-500'
    if (progressValue >= 50) return 'bg-blue-500'
    if (progressValue >= 25) return 'bg-yellow-500'
    return 'bg-slate-400'
  }

  const resolvedIsMyGroup =
    typeof isMyGroup === 'boolean'
      ? isMyGroup
      : typeof group?.isMyGroup === 'boolean'
        ? group.isMyGroup
        : undefined

  const isClickable = Boolean(onClick) || resolvedIsMyGroup === true

  return (
    <Card
      className={`group flex flex-col h-full border-2 transition-all ${
        isClickable
          ? 'cursor-pointer hover:shadow-md hover:border-blue-300'
          : 'cursor-default'
      }`}
      onClick={onClick}
    >
      <CardHeader className='pb-3 flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-lg group-hover:text-blue-600 transition-colors'>
          {group.name}
        </CardTitle>
        {actionButton}
      </CardHeader>

      <CardContent className='flex-1 flex flex-col space-y-4'>
        <div className='flex items-center gap-2 text-sm text-slate-600'>
          <Users className='h-4 w-4' />
          <span className='font-medium'>
            {memberCount} / {memberLimit} thành viên
          </span>
          {isFull && (
            <Badge className='ml-auto text-xs border-emerald-200 bg-emerald-50 text-emerald-700'>
              Đầy đủ
            </Badge>
          )}
        </div>

        {/* Chỉ hiện tiến độ khi progress không phải null */}
        {hasProgress && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-slate-600 font-medium'>Tiến độ dự án</span>
              <span className='font-bold text-slate-900'>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className='h-2'
              indicatorClassName={getProgressColor(progress)}
            />
          </div>
        )}

        {resolvedIsMyGroup === false && Boolean(onJoin) && (
          <div className='mt-auto pt-4'>
            <Button
              type='button'
              variant='outline'
              className='w-full rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100'
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                onJoin?.()
              }}
              disabled={isJoinDisabled}
            >
              Xin gia nhập
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
