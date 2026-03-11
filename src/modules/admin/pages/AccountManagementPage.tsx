import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Plus } from 'lucide-react'
import AccountsTable from '../components/AccountsTable'
import { mockAccounts } from '../types/account'

export default function AccountManagementPage() {
  const [accounts] = useState(mockAccounts)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('Selected file:', file.name)
      console.log('File type:', file.type)
      console.log('File size:', file.size, 'bytes')

      // TODO: Handle file upload and parsing
      alert(`Đã chọn file: ${file.name}`)

      // Reset input
      event.target.value = ''
    }
  }

  const handleAddAccount = () => {
    // TODO: Open dialog to add new account
    console.log('Add account clicked')
    alert('Chức năng thêm tài khoản sẽ được triển khai sau')
  }

  return (
    <div className='flex-1 p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-slate-900'>
          Account Management
        </h1>

        <div className='flex items-center gap-3'>
          {/* Add Account Button */}
          <Button onClick={handleAddAccount} className='gap-2'>
            <Plus className='h-4 w-4' />
            Thêm tài khoản
          </Button>

          {/* Import Excel Button */}
          <Button
            variant='outline'
            onClick={handleImportClick}
            className='gap-2'
          >
            <Upload className='h-4 w-4' />
            Import Excel
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type='file'
            accept='.xlsx,.csv'
            onChange={handleFileChange}
            className='hidden'
          />
        </div>
      </div>

      {/* Info Text */}
      <p className='text-sm text-slate-600'>
        Quản lý danh sách tài khoản người dùng trong hệ thống. Bạn có thể thêm
        tài khoản thủ công hoặc import từ file Excel.
      </p>

      {/* Accounts Table */}
      <AccountsTable accounts={accounts} />

      {/* Stats */}
      <div className='flex items-center gap-6 text-sm text-slate-600'>
        <span>
          Tổng số tài khoản: <strong>{accounts.length}</strong>
        </span>
        <span>
          Đang hoạt động:{' '}
          <strong className='text-green-600'>
            {accounts.filter(a => a.status === 'Active').length}
          </strong>
        </span>
        <span>
          Vô hiệu hóa:{' '}
          <strong className='text-slate-500'>
            {accounts.filter(a => a.status === 'Inactive').length}
          </strong>
        </span>
      </div>
    </div>
  )
}
