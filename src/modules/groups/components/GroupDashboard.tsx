import { Plus, UserPlus, User, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

// TypeScript Interface
interface Group {
  id: string
  name: string
  subject: string
  membersCount: number
  maxMembers: number
  progress: number
}

// Mock Data
const MOCK_GROUPS: Group[] = [
  {
    id: 'group-001',
    name: 'MERN Stack E-commerce',
    subject: 'Web Development',
    membersCount: 4,
    maxMembers: 5,
    progress: 75
  },
  {
    id: 'group-002',
    name: 'React Native Mobile App',
    subject: 'Mobile Development',
    membersCount: 3,
    maxMembers: 4,
    progress: 45
  },
  {
    id: 'group-003',
    name: 'AI Chatbot with Python',
    subject: 'Artificial Intelligence',
    membersCount: 5,
    maxMembers: 5,
    progress: 90
  },
  {
    id: 'group-004',
    name: 'Cloud Infrastructure Project',
    subject: 'DevOps & Cloud',
    membersCount: 2,
    maxMembers: 6,
    progress: 30
  }
]

export default function GroupDashboard() {
  const handleCreateGroup = () => {
    console.log('Create new group')
  }

  const handleJoinGroup = () => {
    console.log('Join existing group')
  }

  const handleViewGroup = (groupId: string) => {
    console.log('View group:', groupId)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-slate-400'
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
          <Button onClick={handleCreateGroup} className='gap-2'>
            <Plus className='h-4 w-4' />
            Create Group
          </Button>
          <Button onClick={handleJoinGroup} variant='outline' className='gap-2'>
            <UserPlus className='h-4 w-4' />
            Join Group
          </Button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {MOCK_GROUPS.map(group => (
          <Card
            key={group.id}
            className='hover:shadow-lg transition-shadow cursor-pointer group'
            onClick={() => handleViewGroup(group.id)}
          >
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between mb-2'>
                <Badge variant='secondary' className='text-xs'>
                  {group.subject}
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
              <div className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400'>
                <User className='h-4 w-4' />
                <span className='font-medium'>
                  {group.membersCount} / {group.maxMembers} members
                </span>
                {group.membersCount === group.maxMembers && (
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
        ))}
      </div>

      {/* Empty State (optional) */}
      {MOCK_GROUPS.length === 0 && (
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
            <Button onClick={handleCreateGroup} className='gap-2'>
              <Plus className='h-4 w-4' />
              Create Group
            </Button>
            <Button
              onClick={handleJoinGroup}
              variant='outline'
              className='gap-2'
            >
              <UserPlus className='h-4 w-4' />
              Join Group
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
