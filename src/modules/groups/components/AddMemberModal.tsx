import { useEffect, useMemo, useState } from 'react'
import { Loader2, UserPlus, Check, Search, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input' // <-- THÊM IMPORT INPUT
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'

export interface User {
  id: number
  fullName: string
  email: string
  avatar?: string
}

type MemberRole = 'Member' | 'Leader'

interface AddMemberPayload {
  userId: number
  role: MemberRole
}

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  groupId: number
  groupName: string
  onConfirm?: (payload: AddMemberPayload) => Promise<void> | void
}

// Hàm Fake API để test giao diện trước (Giữ nguyên)
const searchUsersAPI = async (keyword: string): Promise<User[]> => {
  const normalized = keyword.trim().toLowerCase()
  await new Promise(resolve => setTimeout(resolve, 550))

  if (!normalized) {
    return [
      {
        id: 1,
        fullName: 'Minh Trí',
        email: 'minhtri@student.edu.vn',
        avatar: ''
      },
      {
        id: 2,
        fullName: 'Trí Nguyễn',
        email: 'tri.nguyen@student.edu.vn',
        avatar: ''
      },
      { id: 3, fullName: 'Trí Tri', email: 'tritri@student.edu.vn', avatar: '' }
    ]
  }

  const firstWord = normalized.split(' ')[0] || normalized
  const titleWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1)

  return Array.from({ length: 4 }, (_, index) => {
    const itemIndex = index + 1
    return {
      id: itemIndex + 10,
      fullName: `${titleWord} ${itemIndex}`,
      email: `${firstWord}${itemIndex}@student.edu.vn`,
      avatar: ''
    }
  })
}

const getAvatarFallback = (fullName: string) => {
  if (!fullName) return 'U'
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(part => part[0]?.toUpperCase())
    .join('')
}

export default function AddMemberModal({
  isOpen,
  onClose,
  groupId,
  groupName,
  onConfirm
}: AddMemberModalProps) {
  // --- CÁC STATE CỦA TÌM KIẾM (GIỮ NGUYÊN ĐỂ SAU NÀY DÙNG LẠI) ---
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  // --- STATE CHUNG ---
  const [selectedRole, setSelectedRole] = useState<MemberRole>('Member')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // --- STATE MỚI CHO TÍNH NĂNG THÊM NHANH BẰNG ID ---
  const [quickUserId, setQuickUserId] = useState('')

  const debouncedSearch = useDebounce(searchValue, 300)

  useEffect(() => {
    let isMounted = true
    const fetchUsers = async () => {
      setIsSearching(true)
      try {
        const result = await searchUsersAPI(debouncedSearch)
        if (isMounted) setUsers(result)
      } finally {
        if (isMounted) setIsSearching(false)
      }
    }
    fetchUsers()
    return () => {
      isMounted = false
    }
  }, [debouncedSearch])

  // Logic cũ (giữ nguyên)
  useEffect(() => {
    if (selectedUsers.length > 1 && selectedRole === 'Leader') {
      setSelectedRole('Member')
    }
  }, [selectedUsers, selectedRole])

  // Logic cũ (giữ nguyên)
  const hasNoResult = useMemo(() => {
    return (
      debouncedSearch.trim().length > 0 && !isSearching && users.length === 0
    )
  }, [debouncedSearch, isSearching, users])

  // Logic cũ (giữ nguyên)
  const toggleSelectUser = (user: User) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id)
      if (isSelected) {
        return prev.filter(u => u.id !== user.id)
      }
      return [...prev, user]
    })
    setSearchValue('')
  }

  // Logic cũ (giữ nguyên)
  const removeSelectedUser = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedUsers(prev => prev.filter(u => u.id !== id))
  }

  const handleClose = () => {
    if (isSubmitting) return
    setOpenCombobox(false)
    setSearchValue('')
    setSelectedUsers([])
    setSelectedRole('Member')
    setQuickUserId('') // Reset ô nhập ID nhanh
    onClose()
  }

  // SỬA LẠI HÀM CONFIRM ĐỂ DÙNG quickUserId THAY VÌ selectedUsers
  const handleConfirm = async () => {
    // Nếu dùng tính năng tìm kiếm (sau này mở lại):
    // if (selectedUsers.length === 0) return

    // Hiện tại dùng ID nhanh:
    const parsedId = Number(quickUserId)
    if (!quickUserId.trim() || isNaN(parsedId) || parsedId <= 0) return

    setIsSubmitting(true)
    try {
      if (onConfirm) {
        // --- LOGIC GŨ (Khi dùng tính năng tìm kiếm) ---
        // for (const user of selectedUsers) {
        //   const payload: AddMemberPayload = {
        //     userId: user.id,
        //     role: selectedRole
        //   }
        //   await onConfirm(payload)
        // }

        // --- LOGIC MỚI (Thêm nhanh 1 user) ---
        const payload: AddMemberPayload = {
          userId: parsedId,
          role: selectedRole
        }
        await onConfirm(payload)
      }
      handleClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <UserPlus className='h-5 w-5 text-blue-600' />
            Thêm thành viên mới
          </DialogTitle>
          <DialogDescription>
            {/* Đổi description tạm thời */}
            Nhập trực tiếp ID để thêm thành viên vào nhóm{' '}
            <span className='font-semibold text-foreground'>{groupName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          <div className='space-y-2'>
            <Label htmlFor='member-search'>
              Thành viên đã chọn (Nhập ID User)
            </Label>

            {/* --- BẮT ĐẦU: KHU VỰC TÌM KIẾM ĐÃ ĐƯỢC COMMENT --- */}
            {/* <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              ... (Toàn bộ code Popover và Command của bạn ở đây) ...
            </Popover> 
            */}
            {/* --- KẾT THÚC: KHU VỰC TÌM KIẾM ĐÃ ĐƯỢC COMMENT --- */}

            {/* --- BẮT ĐẦU: Ô NHẬP ID TẠM THỜI --- */}
            <Input
              id='quick-user-id'
              type='number'
              placeholder='Nhập ID của người dùng (VD: 1, 2, 3...)'
              value={quickUserId}
              onChange={e => setQuickUserId(e.target.value)}
              disabled={isSubmitting}
            />
            {/* --- KẾT THÚC: Ô NHẬP ID TẠM THỜI --- */}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='member-role'>Vai trò chung</Label>
            <Select
              value={selectedRole}
              onValueChange={value => setSelectedRole(value as MemberRole)}
              disabled={isSubmitting}
            >
              <SelectTrigger id='member-role'>
                <SelectValue placeholder='Chọn vai trò' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Member'>Member</SelectItem>
                {/* Tạm thời bỏ disabled vì bây giờ chỉ thêm 1 người mỗi lần 
                  disabled={selectedUsers.length > 1}
                */}
                <SelectItem value='Leader'>Leader</SelectItem>
              </SelectContent>
            </Select>
            {/* Tạm ẩn cảnh báo vì giờ chỉ nhập 1 ID 
              {selectedUsers.length > 1 && (...)} 
            */}
          </div>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type='button'
            onClick={handleConfirm}
            // Đổi điều kiện disabled: khóa nút nếu ô input rỗng
            disabled={!quickUserId.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang thêm...
              </>
            ) : (
              // Sửa lại text cho phù hợp
              'Thêm thành viên'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
