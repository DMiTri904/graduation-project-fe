import { Search, Bell, Moon, HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen w-full bg-white text-slate-900 overflow-hidden'>
      {/* 1. SIDEBAR (Bên trái) */}
      <aside className='w-65 border-r border-slate-200 flex flex-col justify-between p-4 shrink-0'>
        <div>
          {/* Logo */}
          <div className='flex items-center gap-3 px-2 mb-8'>
            <div className='w-8 h-8 bg-blue-600 rounded-md'></div>
            <div>
              <h2 className='font-bold text-base'>NTU Group</h2>
              <p className='text-xs text-slate-500'>Project Management</p>
            </div>
          </div>

          {/* Navigation Items (Giả lập) */}
          <nav className='space-y-1'>
            <Button
              variant='secondary'
              className='w-full justify-start text-blue-600 bg-blue-50'
            >
              Dashboard
            </Button>
            <Button
              variant='ghost'
              className='w-full justify-start text-slate-600'
            >
              My Groups
            </Button>
            {/* Thêm các menu khác ở đây... */}
          </nav>
        </div>

        {/* Upcoming Deadline Card */}
        <div className='bg-slate-50 border rounded-xl p-4'>
          <h4 className='text-xs font-semibold text-blue-600 mb-2 uppercase'>
            Upcoming Deadline
          </h4>
          <p className='text-sm font-medium mb-1'>Capstone Draft v1</p>
          <p className='text-xs text-slate-500'>Due in 2 days</p>
        </div>
      </aside>

      {/* 2. MAIN CONTENT (Bên phải) */}
      <main className='flex-1 flex flex-col min-w-0'>
        {/* APPBAR (Thanh điều hướng trên) */}
        <header className='h-18 border-b border-slate-200 flex items-center justify-between px-6 shrink-0'>
          {/* Search */}
          <div className='w-96 relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-slate-400' />
            <Input
              type='text'
              placeholder='Search tasks, groups, or files...'
              className='pl-9 bg-slate-50 border-none'
            />
          </div>

          {/* Right Icons & Profile */}
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='icon'
              className='text-slate-500 rounded-full'
            >
              <Moon className='h-5 w-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='text-slate-500 rounded-full'
            >
              <Bell className='h-5 w-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='text-slate-500 rounded-full'
            >
              <HelpCircle className='h-5 w-5' />
            </Button>
            <div className='h-8 w-px bg-slate-200 mx-2'></div>{' '}
            {/* Dọc phân cách */}
            <div className='flex items-center gap-3 text-right'>
              <div>
                <p className='text-sm font-semibold leading-none'>
                  Phan Minh Tri
                </p>
                <p className='text-xs text-slate-500 mt-1'>
                  Student ID: 63135432
                </p>
              </div>
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>MT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* 3. BOARD AREA (Nơi chứa Bảng kéo thả) */}
        <div className='flex-1 overflow-x-hidden'>{children}</div>
      </main>
    </div>
  )
}
