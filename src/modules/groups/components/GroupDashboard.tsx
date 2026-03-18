import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, UserPlus, User, TrendingUp, FileUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useGetGroups } from '../hooks/useGroups'
import CreateGroupModal from './CreateGroupModal'
import JoinGroupModal from './JoinGroupModal'
import ImportFileDialog from './ImportFileDialog'

export default function GroupDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  // Fetch groups using React Query
  const {
    data: groups = [],
    isLoading,
    isError,
    error,
    refetch
  } = useGetGroups()

  const handleImportSuccess = () => {
    console.log('Import success! Reloading data...')
    refetch()
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-slate-400'
  }

  // Loading State
  if (isLoading) {
    return (
      <div className='container mx-auto p-6'>
        <div className='flex flex-col items-center justify-center py-20'>
          <Loader2 className='h-12 w-12 animate-spin text-blue-600 mb-4' />
          <p className='text-slate-600'>Đang tải danh sách nhóm...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (isError) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : 'Có lỗi xảy ra khi tải danh sách nhóm'

    return (
      <div className='container mx-auto p-6'>
        <div className='flex flex-col items-center justify-center py-20'>
          <div className='text-red-500 mb-4'>❌</div>
          <h3 className='text-xl font-semibold text-slate-900 mb-2'>
            Không thể tải dữ liệu
          </h3>
          <p className='text-slate-600 mb-4'>{errorMessage}</p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
            My Groups
          </h1>
          <p className='text-slate-600 dark:text-slate-400 mt-1'>
            Manage your project groups and collaborations
          </p>
        </div>

        <div className='flex gap-3'>
          <Button onClick={() => setIsCreateModalOpen(true)} className='gap-2'>
            <Plus className='h-4 w-4' />
            Create Group
          </Button>
          <Button
            onClick={() => setIsJoinModalOpen(true)}
            variant='outline'
            className='gap-2'
          >
            <UserPlus className='h-4 w-4' />
            Join Group
          </Button>
          <Button
            onClick={() => setIsImportDialogOpen(true)}
            variant='secondary'
            className='gap-2'
          >
            <FileUp className='h-4 w-4' />
            Import
          </Button>
        </div>
      </div>

      {/* Groups Grid */}
      {groups.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {groups.map(group => (
            <Link key={group.id} to={`/groups/${group.id}`} className='block'>
              <Card className='hover:shadow-lg transition-shadow cursor-pointer group h-full'>
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between mb-2'>
                    <Badge variant='secondary' className='text-xs'>
                      {group.category}
                    </Badge>
                    <TrendingUp
                      className={`h-4 w-4 ${
                        group.progress >= 50
                          ? 'text-green-500'
                          : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <CardTitle className='text-lg group-hover:text-blue-600 transition-colors'>
                    {group.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className='space-y-4'>
                  {/* Members Count */}
                  <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
                    <User className='h-4 w-4' />
                    <span className='font-medium'>
                      {group.memberCount} / {group.maxMembers} members
                    </span>
                    {group.maxMembers > 0 &&
                      group.memberCount === group.maxMembers && (
                        <Badge variant='outline' className='ml-auto text-xs'>
                          Full
                        </Badge>
                      )}
                  </div>

                  {/* Progress Section */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-slate-600 dark:text-slate-400 font-medium'>
                        Progress
                      </span>
                      <span className='font-bold text-slate-900 dark:text-slate-100'>
                        {group.progress}%
                      </span>
                    </div>
                    <Progress
                      value={group.progress}
                      className='h-2'
                      indicatorClassName={getProgressColor(group.progress)}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className='flex flex-col items-center justify-center py-16 text-center'>
          <div className='rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-4'>
            <User className='h-12 w-12 text-slate-400' />
          </div>
          <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2'>
            No groups yet
          </h3>
          <p className='text-slate-600 dark:text-slate-400 mb-6 max-w-sm'>
            Create your first group or join an existing one to start
            collaborating on projects.
          </p>
          <div className='flex gap-3'>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className='gap-2'
            >
              <Plus className='h-4 w-4' />
              Create Group
            </Button>
            <Button
              onClick={() => setIsJoinModalOpen(true)}
              variant='outline'
              className='gap-2'
            >
              <UserPlus className='h-4 w-4' />
              Join Group
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <ImportFileDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  )
}
