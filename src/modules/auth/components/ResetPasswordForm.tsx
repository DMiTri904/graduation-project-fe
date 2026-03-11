import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { ResetPasswordFormType } from '../types/reset-password'

interface ResetPasswordFormProps {
  email: string
  register: UseFormRegister<ResetPasswordFormType>
  errors: FieldErrors<ResetPasswordFormType>
  loading: boolean
  canSubmit: boolean
  onSubmit: (e: React.FormEvent) => void
  handlePasswordKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleConfirmKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function ResetPasswordForm({
  email,
  register,
  errors,
  loading,
  canSubmit,
  onSubmit,
  handlePasswordKeyDown,
  handleConfirmKeyDown
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className='w-full max-w-md space-y-6'>
      {/* Header */}
      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold text-slate-900'>Đặt lại mật khẩu</h1>
        <p className='text-sm text-slate-600'>
          Đặt lại mật khẩu cho tài khoản:{' '}
          <span className='font-medium text-blue-600'>{email}</span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className='space-y-4'>
        {/* New Password */}
        <div className='space-y-2'>
          <Label htmlFor='newPassword'>Mật khẩu mới</Label>
          <div className='relative'>
            <Input
              id='newPassword'
              type={showPassword ? 'text' : 'password'}
              placeholder='Nhập mật khẩu mới (tối thiểu 6 ký tự)'
              {...register('newPassword')}
              onKeyDown={handlePasswordKeyDown}
              className={errors.newPassword ? 'border-red-500' : ''}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700'
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className='text-xs text-red-500'>{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className='space-y-2'>
          <Label htmlFor='passwordConfirm'>Xác nhận mật khẩu</Label>
          <div className='relative'>
            <Input
              id='passwordConfirm'
              type={showConfirm ? 'text' : 'password'}
              placeholder='Nhập lại mật khẩu mới'
              {...register('passwordConfirm')}
              onKeyDown={handleConfirmKeyDown}
              className={errors.passwordConfirm ? 'border-red-500' : ''}
            />
            <button
              type='button'
              onClick={() => setShowConfirm(!showConfirm)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700'
            >
              {showConfirm ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
          {errors.passwordConfirm && (
            <p className='text-xs text-red-500'>
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          className='w-full'
          disabled={!canSubmit}
          size='lg'
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang xử lý...
            </>
          ) : (
            'Đặt lại mật khẩu'
          )}
        </Button>
      </form>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription className='text-xs'>
          Mật khẩu mới phải có ít nhất 6 ký tự và 2 ô mật khẩu phải khớp nhau.
        </AlertDescription>
      </Alert>
    </div>
  )
}
