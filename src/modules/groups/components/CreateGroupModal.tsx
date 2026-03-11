import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useCreateGroup } from '../hooks/useGroups'
import { GROUP_CATEGORIES } from '../types/group'
import {
  createGroupSchema,
  type CreateGroupFormData
} from '../types/validation'

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  onSuccess
}: CreateGroupModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { mutate: createGroup, isPending } = useCreateGroup()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CreateGroupFormData>({
    resolver: yupResolver(createGroupSchema),
    defaultValues: {
      maxMembers: 5
    }
  })

  const handleClose = () => {
    reset()
    setSelectedCategory('')
    onClose()
  }

  const onSubmit = (data: CreateGroupFormData) => {
    createGroup(
      {
        name: data.name,
        category: data.category,
        maxMembers: data.maxMembers
      },
      {
        onSuccess: newGroup => {
          console.log('Group created:', newGroup)
          handleClose()
          onSuccess?.()
          // Show success message
          alert(
            `Nhóm "${newGroup.name}" đã được tạo thành công!\nMã tham gia: ${newGroup.inviteCode}`
          )
        },
        onError: error => {
          console.error('Create group error:', error)
          alert('Có lỗi xảy ra khi tạo nhóm. Vui lòng thử lại.')
        }
      }
    )
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={handleClose}
      />

      {/* Modal */}
      <div className='relative z-50 w-full max-w-md bg-white rounded-lg shadow-xl p-6 m-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-slate-900'>Tạo nhóm mới</h2>
          <button
            onClick={handleClose}
            className='text-slate-400 hover:text-slate-600 transition-colors'
            disabled={isPending}
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Group Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>
              Tên nhóm <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='name'
              placeholder='Ví dụ: MERN Stack E-commerce'
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
              disabled={isPending}
            />
            {errors.name && (
              <p className='text-xs text-red-500'>{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className='space-y-2'>
            <Label htmlFor='category'>
              Danh mục <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={value => {
                setSelectedCategory(value)
                setValue('category', value)
              }}
              disabled={isPending}
            >
              <SelectTrigger
                className={errors.category ? 'border-red-500' : ''}
              >
                <SelectValue placeholder='Chọn danh mục dự án' />
              </SelectTrigger>
              <SelectContent>
                {GROUP_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className='text-xs text-red-500'>{errors.category.message}</p>
            )}
          </div>

          {/* Max Members */}
          <div className='space-y-2'>
            <Label htmlFor='maxMembers'>Số thành viên tối đa</Label>
            <Input
              id='maxMembers'
              type='number'
              min={2}
              max={20}
              {...register('maxMembers', { valueAsNumber: true })}
              className={errors.maxMembers ? 'border-red-500' : ''}
              disabled={isPending}
            />
            {errors.maxMembers && (
              <p className='text-xs text-red-500'>
                {errors.maxMembers.message}
              </p>
            )}
            <p className='text-xs text-slate-500'>
              Số lượng thành viên tối đa có thể tham gia nhóm (2-20)
            </p>
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='flex-1'
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type='submit' className='flex-1' disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang tạo...
                </>
              ) : (
                'Tạo nhóm'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
