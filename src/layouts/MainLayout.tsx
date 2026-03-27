import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '@/components/Header'

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
  // Lấy đường dẫn hiện tại để check active state
  const { pathname } = useLocation()

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

          {/* Navigation Items (Đã dùng vòng lặp) */}
          <nav className='space-y-1'>
            {NAV_ITEMS.map(item => {
              // Kiểm tra xem nút đang render có khớp với đường dẫn hiện tại không
              const isActive =
                item.path === '/'
                  ? pathname === '/'
                  : pathname === item.path ||
                    pathname.startsWith(`${item.path}/`)

              return (
                <Button
                  key={item.path}
                  // Đổi variant của shadcn theo trạng thái active
                  variant={isActive ? 'secondary' : 'ghost'}
                  // Cập nhật class màu sắc tương ứng
                  className={`w-full justify-start ${
                    isActive
                      ? 'text-blue-600 bg-blue-50' // Màu xanh khi đang ở trang đó
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' // Màu xám khi ở trang khác
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              )
            })}
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
        <Header />

        {/* 3. BOARD AREA (Nơi chứa Bảng kéo thả) */}
        <div className='flex-1 min-h-0 overflow-hidden'>{children}</div>
      </main>
    </div>
  )
}
