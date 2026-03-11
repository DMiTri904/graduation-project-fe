import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Account } from '../types/account'

interface AccountsTableProps {
  accounts: Account[]
}

export default function AccountsTable({ accounts }: AccountsTableProps) {
  return (
    <div className='rounded-md border border-slate-200 bg-white'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-15'>STT</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Mã SV</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='text-center text-slate-500'>
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account, index) => (
              <TableRow key={account.id}>
                <TableCell className='font-medium'>{index + 1}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.fullName}</TableCell>
                <TableCell className='font-mono text-sm'>
                  {account.mssv}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={account.role === 'Admin' ? 'default' : 'secondary'}
                  >
                    {account.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      account.status === 'Active' ? 'default' : 'secondary'
                    }
                    className={
                      account.status === 'Active'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-slate-400 hover:bg-slate-500'
                    }
                  >
                    {account.status === 'Active' ? 'Hoạt động' : 'Vô hiệu'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
