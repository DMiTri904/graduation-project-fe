import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/' },
  { label: 'My Groups', path: '/groups' },
  { label: 'My Classes', path: '/classes' },
  { label: 'Accounts', path: '/account-management' }
  // { label: 'Settings', path: '/settings' },
]

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  // Lấy đường dẫn hiện tại để check active state
  const { pathname } = useLocation()

  const renderNavigation = (onItemClick?: () => void) => (
    <nav className='space-y-1'>
      {NAV_ITEMS.map(item => {
        const isActive =
          item.path === '/'
            ? pathname === '/'
            : pathname === item.path || pathname.startsWith(`${item.path}/`)

        return (
          <Button
            key={item.path}
            variant={isActive ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${
              isActive
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            onClick={() => {
              navigate(item.path)
              onItemClick?.()
            }}
          >
            {item.label}
          </Button>
        )
      })}
    </nav>
  )

  return (
    <div className='flex h-dvh w-full overflow-hidden bg-white text-slate-900'>
      {/* 1. SIDEBAR (Bên trái) */}
      <aside className='hidden lg:flex lg:sticky lg:top-0 lg:h-dvh w-72 border-r border-slate-200 flex-col justify-between p-4 shrink-0'>
        <div>
          {/* Logo */}
          <div className='flex items-center gap-3 px-2 mb-8'>
            <div className='w-8 h-8 bg-blue-600 rounded-md'></div>
            <div>
              <h2 className='font-bold text-base'>NTU Group</h2>
              <p className='text-xs text-slate-500'>Project Management</p>
            </div>
          </div>
          {renderNavigation()}
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
      <main className='flex min-w-0 flex-1 flex-col overflow-x-hidden'>
        <Header
          mobileSidebarTrigger={
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-9 w-9 lg:hidden'
                onClick={() => setIsSidebarOpen(true)}
                aria-label='Mở menu điều hướng'
              >
                <Menu className='h-5 w-5' />
              </Button>
              <SheetContent side='left' className='w-[85vw] max-w-xs p-4'>
                <SheetHeader>
                  <SheetTitle>NTU Group</SheetTitle>
                </SheetHeader>
                <div className='mt-6'>
                  {renderNavigation(() => setIsSidebarOpen(false))}
                </div>
              </SheetContent>
            </Sheet>
          }
        />

        {/* 3. BOARD AREA (Nơi chứa Bảng kéo thả) */}
        <div className='flex-1 min-h-0 overflow-hidden'>{children}</div>
      </main>
    </div>
  )
}
