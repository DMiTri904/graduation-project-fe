import { useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { SUBJECTS } from '../types/class'

interface CreateClassModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreateClassModal({
  isOpen,
  onClose,
  onSuccess
}: CreateClassModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    maxStudents: 50
  })
  const [errors, setErrors] = useState({
    name: '',
    subject: '',
    maxStudents: ''
  })

  const validateForm = () => {
    const newErrors = {
      name: '',
      subject: '',
      maxStudents: ''
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Tên lớp học là bắt buộc'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Tên lớp học phải có ít nhất 3 ký tự'
    }

    if (!formData.subject) {
      newErrors.subject = 'Vui lòng chọn môn học'
    }

    if (formData.maxStudents < 10 || formData.maxStudents > 100) {
      newErrors.maxStudents = 'Số lượng sinh viên phải từ 10 đến 100'
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.subject && !newErrors.maxStudents
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate random join code
    const joinCode =
      formData.name.substring(0, 3).toUpperCase() +
      Math.random().toString(36).substring(2, 8).toUpperCase()

    console.log('Created class:', {
      ...formData,
      joinCode
    })

    setIsSubmitting(false)
    handleClose()
    onSuccess?.()

    alert(
      `Lớp học "${formData.name}" đã được tạo thành công!\nMã tham gia: ${joinCode}`
    )
  }

  const handleClose = () => {
    setFormData({
      name: '',
      subject: '',
      maxStudents: 50
    })
    setErrors({
      name: '',
      subject: '',
      maxStudents: ''
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-125'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            Tạo lớp học mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-5 mt-4'>
          {/* Class Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>
              Tên lớp học <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='name'
              placeholder='Ví dụ: Thực hành Web - Ca 1'
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className='text-xs text-red-500'>{errors.name}</p>
            )}
          </div>

          {/* Subject */}
          <div className='space-y-2'>
            <Label htmlFor='subject'>
              Môn học <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={formData.subject}
              onValueChange={value =>
                setFormData({ ...formData, subject: value })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className={errors.subject ? 'border-red-500' : ''}>
                <SelectValue placeholder='Chọn môn học' />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className='text-xs text-red-500'>{errors.subject}</p>
            )}
          </div>

          {/* Max Students */}
          <div className='space-y-2'>
            <Label htmlFor='maxStudents'>Số lượng sinh viên tối đa</Label>
            <Input
              id='maxStudents'
              type='number'
              min={10}
              max={100}
              value={formData.maxStudents}
              onChange={e =>
                setFormData({
                  ...formData,
                  maxStudents: parseInt(e.target.value) || 50
                })
              }
              className={errors.maxStudents ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.maxStudents && (
              <p className='text-xs text-red-500'>{errors.maxStudents}</p>
            )}
            <p className='text-xs text-slate-500'>
              Số lượng sinh viên tối đa có thể tham gia lớp học (10-100)
            </p>
          </div>

          {/* Info Box */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <h4 className='text-sm font-medium text-blue-900 mb-2'>💡 Lưu ý</h4>
            <ul className='text-xs text-blue-700 space-y-1'>
              <li>• Mã tham gia sẽ được tự động tạo sau khi tạo lớp</li>
              <li>• Sinh viên dùng mã này để tham gia lớp học</li>
              <li>• Bạn có thể chia sẻ mã cho sinh viên qua email hoặc LMS</li>
            </ul>
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='flex-1'
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type='submit' className='flex-1' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang tạo...
                </>
              ) : (
                'Tạo lớp học'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
