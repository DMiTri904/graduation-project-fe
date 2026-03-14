import { Bell, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Student } from '../types/class'

interface UngroupedStudentsTableProps {
  students: Student[]
  onRemind: (studentId: string) => void
  onAddToGroup: (studentId: string) => void
}

export default function UngroupedStudentsTable({
  students,
  onRemind,
  onAddToGroup
}: UngroupedStudentsTableProps) {
  if (students.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='rounded-full bg-green-100 p-4 mb-4'>
          <UserPlus className='h-8 w-8 text-green-600' />
        </div>
        <h3 className='text-lg font-semibold text-slate-900 mb-2'>
          Tất cả sinh viên đã có nhóm
        </h3>
        <p className='text-slate-600 text-sm max-w-md'>
          Không còn sinh viên nào chưa tham gia nhóm. Tuyệt vời! 🎉
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Info Banner */}
      <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
        <div className='flex items-start gap-3'>
          <Bell className='h-5 w-5 text-amber-600 mt-0.5' />
          <div>
            <h4 className='text-sm font-medium text-amber-900 mb-1'>
              {students.length} sinh viên chưa vào nhóm
            </h4>
            <p className='text-xs text-amber-700'>
              Bạn có thể nhắc nhở sinh viên tạo/tham gia nhóm hoặc thêm họ vào
              nhóm có sẵn
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='rounded-md border border-slate-200 bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-25'>MSSV</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className='text-right w-50'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell className='font-mono text-sm font-medium'>
                  {student.mssv}
                </TableCell>
                <TableCell className='font-medium'>
                  {student.fullName}
                </TableCell>
                <TableCell className='text-slate-600'>
                  {student.email}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onRemind(student.id)}
                      className='gap-1'
                    >
                      <Bell className='h-3 w-3' />
                      Nhắc nhở
                    </Button>
                    <Button
                      variant='default'
                      size='sm'
                      onClick={() => onAddToGroup(student.id)}
                      className='gap-1'
                    >
                      <UserPlus className='h-3 w-3' />
                      Thêm vào nhóm
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
