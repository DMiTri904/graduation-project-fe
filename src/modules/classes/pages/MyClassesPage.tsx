import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, Copy, CheckCircle2, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CreateClassModal from '../components/CreateClassModal'
import { MOCK_CLASSES } from '../types/class'

export default function MyClassesPage() {
  const navigate = useNavigate()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Mock data
  const classes = MOCK_CLASSES

  const handleCopyJoinCode = (joinCode: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    navigator.clipboard.writeText(joinCode)
    setCopiedCode(joinCode)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleViewClass = (classId: string) => {
    navigate(`/classes/${classId}`)
  }

  const getStudentPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100)
  }

  return (
    <div className='flex-1 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-slate-900'>
            Quản lý Lớp học của tôi
          </h1>
          <p className='text-slate-600 mt-2'>
            Quản lý các lớp học và theo dõi tiến độ nhóm sinh viên
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className='gap-2'>
          <Plus className='h-4 w-4' />
          Tạo Lớp Học
        </Button>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-slate-600 mb-1'>Tổng số lớp</p>
                <p className='text-3xl font-bold text-slate-900'>
                  {classes.length}
                </p>
              </div>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-slate-600 mb-1'>Tổng sinh viên</p>
                <p className='text-3xl font-bold text-slate-900'>
                  {classes.reduce((sum, c) => sum + c.studentCount, 0)}
                </p>
              </div>
              <div className='p-3 bg-green-100 rounded-lg'>
                <UserCircle className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-slate-600 mb-1'>Tổng nhóm</p>
                <p className='text-3xl font-bold text-slate-900'>
                  {classes.reduce((sum, c) => sum + c.groupCount, 0)}
                </p>
              </div>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <Users className='h-6 w-6 text-purple-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      {classes.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {classes.map(classItem => (
            <Card
              key={classItem.id}
              className='hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-blue-200'
              onClick={() => handleViewClass(classItem.id)}
            >
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between mb-2'>
                  <Badge variant='secondary' className='text-xs'>
                    {classItem.subject}
                  </Badge>
                  <Badge
                    variant='outline'
                    className={
                      getStudentPercentage(
                        classItem.studentCount,
                        classItem.maxStudents
                      ) >= 80
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }
                  >
                    {classItem.studentCount}/{classItem.maxStudents} SV
                  </Badge>
                </div>
                <CardTitle className='text-xl group-hover:text-blue-600 transition-colors'>
                  {classItem.name}
                </CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                {/* Join Code Section */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                  <p className='text-xs text-blue-600 font-medium mb-1'>
                    MÃ THAM GIA
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-lg font-bold text-blue-900 tracking-wider font-mono'>
                      {classItem.joinCode}
                    </span>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={e => handleCopyJoinCode(classItem.joinCode, e)}
                      className='h-8 w-8 p-0'
                    >
                      {copiedCode === classItem.joinCode ? (
                        <CheckCircle2 className='h-4 w-4 text-green-600' />
                      ) : (
                        <Copy className='h-4 w-4 text-blue-600' />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-slate-600 flex items-center gap-2'>
                      <Users className='h-4 w-4' />
                      Sinh viên
                    </span>
                    <span className='font-semibold text-slate-900'>
                      {classItem.studentCount}/{classItem.maxStudents}
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-slate-600'>Số nhóm đã tạo</span>
                    <Badge variant='outline'>{classItem.groupCount} nhóm</Badge>
                  </div>
                </div>

                {/* View Button */}
                <Button
                  variant='outline'
                  className='w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all'
                  onClick={e => {
                    e.stopPropagation()
                    handleViewClass(classItem.id)
                  }}
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <div className='rounded-full bg-slate-100 p-6 mb-4'>
            <Users className='h-12 w-12 text-slate-400' />
          </div>
          <h3 className='text-xl font-semibold text-slate-900 mb-2'>
            Chưa có lớp học nào
          </h3>
          <p className='text-slate-600 mb-6 max-w-sm'>
            Tạo lớp học đầu tiên để bắt đầu quản lý sinh viên và nhóm dự án
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)} className='gap-2'>
            <Plus className='h-4 w-4' />
            Tạo Lớp Học
          </Button>
        </div>
      )}

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // TODO: Refetch classes data
          console.log('Class created successfully')
        }}
      />
    </div>
  )
}
