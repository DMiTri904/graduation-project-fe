import {
  Search,
  Bell,
  Moon,
  HelpCircle,
  User,
  KeyRound,
  LogOut
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { getStoredAvatarUrl, withAvatarVersion } from '@/lib/avatar'
import { getCurrentUserFromToken } from '@/lib/token'
import { useUserProfile } from '@/modules/user/hook/user.hook'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  userName?: string
  studentId?: string
  avatarUrl?: string
}

export default function Header({
  userName,
  studentId,
  avatarUrl
}: HeaderProps) {
  const navigate = useNavigate()
  const { data } = useUserProfile()
  const profileData = data?.data
  const tokenUser = getCurrentUserFromToken()

  const displayName =
    userName ||
    profileData?.fullName ||
    profileData?.name ||
    profileData?.userName ||
    tokenUser.fullName ||
    'User'

  const displayStudentId =
    studentId ||
    profileData?.studentId ||
    profileData?.mssv ||
    profileData?.userCode ||
    tokenUser.studentId ||
    '-'

  const displayAvatar = withAvatarVersion(
    avatarUrl ||
      profileData?.avatarUrl ||
      profileData?.avatar ||
      getStoredAvatarUrl() ||
      tokenUser.avatarUrl ||
      'https://github.com/shadcn.png'
  )
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map(part => part[0]?.toUpperCase())
      .join('') || 'U'

  const Maps = (path: string) => {
    navigate(path)
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')
  }

  return (
    <header className='h-18 border-b border-slate-200 flex items-center justify-between px-6 shrink-0'>
      <div className='w-96 relative'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-slate-400' />
        <Input
          type='text'
          placeholder='Search tasks, groups, or files...'
          className='pl-9 bg-slate-50 border-none'
        />
      </div>

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

        <div className='h-8 w-px bg-slate-200 mx-2'></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              className='flex items-center gap-3 text-right rounded-md px-2 py-1 hover:bg-slate-100 transition-colors'
            >
              <div>
                <p className='text-sm font-semibold leading-none'>
                  {displayName}
                </p>
                <p className='text-xs text-slate-500 mt-1'>
                  Student ID: {displayStudentId}
                </p>
              </div>
              <Avatar>
                <AvatarImage src={displayAvatar} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-52'>
            <DropdownMenuItem onClick={() => Maps('/profile')}>
              <User className='h-4 w-4' />
              Trang cá nhân
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate('/change-password')}>
              <KeyRound className='h-4 w-4' />
              Đổi mật khẩu
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className='text-red-600 focus:text-red-600 focus:bg-red-50'
            >
              <LogOut className='h-4 w-4' />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
