import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { Student } from '../types/class'

interface UngroupedStudentsTableProps {
  students: Student[]
}

export default function UngroupedStudentsTable({
  students
}: UngroupedStudentsTableProps) {
  if (students.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <h3 className='text-lg font-semibold text-slate-900 mb-2'>
          Chưa có sinh viên nào
        </h3>
        <p className='text-slate-600 text-sm max-w-md'>
          Chưa có sinh viên nào trong lớp học này.
        </p>
      </div>
    )
  }

  return (
    <div className='rounded-md border border-slate-200 bg-white'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MSSV</TableHead>
            <TableHead>Họ và tên</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(student => (
            <TableRow key={student.id}>
              <TableCell className='font-mono text-sm font-medium'>
                {student.mssv}
              </TableCell>
              <TableCell className='font-medium'>{student.fullName}</TableCell>
              <TableCell className='text-slate-600'>{student.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
