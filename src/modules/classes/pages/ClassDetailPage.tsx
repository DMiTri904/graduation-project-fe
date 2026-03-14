import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, CheckCircle2, Users, UserCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GroupCard from '../components/GroupCard'
import UngroupedStudentsTable from '../components/UngroupedStudentsTable'
import {
  MOCK_CLASSES,
  MOCK_GROUPS,
  MOCK_UNGROUPED_STUDENTS
} from '../types/class'

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [copiedCode, setCopiedCode] = useState(false)

  // Mock data - Find class by ID
  const classData = MOCK_CLASSES.find(c => c.id === id)
  const groups = MOCK_GROUPS.filter(g => g.classId === id)
  const ungroupedStudents = MOCK_UNGROUPED_STUDENTS

  if (!classData) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-slate-900 mb-2'>
            Không tìm thấy lớp học
          </h2>
          <p className='text-slate-600 mb-6'>
            Lớp học này không tồn tại hoặc đã bị xóa
          </p>
          <Button onClick={() => navigate('/classes')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    )
  }

  const handleCopyJoinCode = () => {
    navigator.clipboard.writeText(classData.joinCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleViewGroup = (groupId: string) => {
    // Navigate to board detail (reuse existing board route)
    navigate(`/boards/${groupId}`)
  }

  const handleRemindStudent = (studentId: string) => {
    console.log('Remind student:', studentId)
    alert('Đã gửi email nhắc nhở sinh viên tạo/tham gia nhóm')
  }

  const handleAddToGroup = (studentId: string) => {
    console.log('Add student to group:', studentId)
    alert('Chức năng thêm sinh viên vào nhóm sẽ được triển khai sau')
  }

  return (
    <div className='flex-1 p-6'>
      {/* Header */}
      <div className='mb-6'>
        <Button
          variant='ghost'
          onClick={() => navigate('/classes')}
          className='mb-4'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Quay lại danh sách lớp
        </Button>

        {/* Class Info Card */}
        <Card className='border-2'>
          <CardHeader>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  <CardTitle className='text-3xl'>{classData.name}</CardTitle>
                  <Badge variant='secondary' className='text-sm'>
                    {classData.subject}
                  </Badge>
                </div>
                <CardDescription className='text-base'>
                  {classData.studentCount} sinh viên • {classData.groupCount}{' '}
                  nhóm đã tạo
                </CardDescription>
              </div>

              {/* Join Code Display */}
              <div className='bg-blue-50 border-2 border-blue-200 rounded-lg p-4 min-w-50'>
                <p className='text-xs text-blue-600 font-semibold mb-2'>
                  MÃ THAM GIA LỚP HỌC
                </p>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-2xl font-bold text-blue-900 tracking-wider font-mono'>
                    {classData.joinCode}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCopyJoinCode}
                    className='h-9 w-9 p-0'
                  >
                    {copiedCode ? (
                      <CheckCircle2 className='h-5 w-5 text-green-600' />
                    ) : (
                      <Copy className='h-5 w-5 text-blue-600' />
                    )}
                  </Button>
                </div>
                <p className='text-xs text-blue-600 mt-2'>
                  Chia sẻ mã này cho sinh viên
                </p>
              </div>
            </div>
          </CardHeader>

          {/* Quick Stats */}
          <CardContent>
            <div className='grid grid-cols-3 gap-4'>
              <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <Users className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                  <p className='text-sm text-slate-600'>Sinh viên</p>
                  <p className='text-xl font-bold text-slate-900'>
                    {classData.studentCount}/{classData.maxStudents}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                <div className='p-2 bg-green-100 rounded-lg'>
                  <Users className='h-5 w-5 text-green-600' />
                </div>
                <div>
                  <p className='text-sm text-slate-600'>Nhóm đã tạo</p>
                  <p className='text-xl font-bold text-slate-900'>
                    {classData.groupCount}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                <div className='p-2 bg-amber-100 rounded-lg'>
                  <UserCircle className='h-5 w-5 text-amber-600' />
                </div>
                <div>
                  <p className='text-sm text-slate-600'>Chưa có nhóm</p>
                  <p className='text-xl font-bold text-slate-900'>
                    {ungroupedStudents.length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue='groups' className='w-full'>
        <TabsList className='grid w-full max-w-md grid-cols-2'>
          <TabsTrigger value='groups' className='gap-2'>
            <Users className='h-4 w-4' />
            Danh sách Nhóm
          </TabsTrigger>
          <TabsTrigger value='ungrouped' className='gap-2'>
            <UserCircle className='h-4 w-4' />
            Sinh viên bơ vơ
            {ungroupedStudents.length > 0 && (
              <Badge
                variant='destructive'
                className='ml-2 h-5 min-w-5 rounded-full p-1 flex justify-center align-center'
              >
                {ungroupedStudents.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Groups Overview */}
        <TabsContent value='groups' className='space-y-4 mt-6'>
          {groups.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {groups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onClick={() => handleViewGroup(group.id)}
                />
              ))}
            </div>
          ) : (
            <Card className='border-dashed border-2'>
              <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='rounded-full bg-slate-100 p-6 mb-4'>
                  <Users className='h-12 w-12 text-slate-400' />
                </div>
                <h3 className='text-xl font-semibold text-slate-900 mb-2'>
                  Chưa có nhóm nào
                </h3>
                <p className='text-slate-600 max-w-md'>
                  Sinh viên chưa tạo nhóm dự án. Các nhóm sẽ hiển thị ở đây sau
                  khi được tạo.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Ungrouped Students */}
        <TabsContent value='ungrouped' className='mt-6'>
          <UngroupedStudentsTable
            students={ungroupedStudents}
            onRemind={handleRemindStudent}
            onAddToGroup={handleAddToGroup}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
