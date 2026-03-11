import { useSearchParams, useNavigate } from 'react-router-dom'
import { useResetPasswordForm } from '../hook/useResetPasswordForm.hook'
import ResetPasswordForm from '../components/ResetPasswordForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { ResetPasswordFormType } from '../types/reset-password'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  // Validate URL parameters
  if (!email || !token) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
        <div className='w-full max-w-md'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Link không hợp lệ. Vui lòng kiểm tra lại email của bạn hoặc yêu
              cầu gửi lại link đặt lại mật khẩu.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const handleResetPassword = async (data: ResetPasswordFormType) => {
    // TODO: Call API to reset password
    console.log('Reset password for:', email)
    console.log('Token:', token)
    console.log('New password:', data.newPassword)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Navigate to login on success
    alert('Đặt lại mật khẩu thành công!')
    navigate('/login')
  }

  const formProps = useResetPasswordForm({
    email,
    onSubmit: handleResetPassword
  })

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
      <ResetPasswordForm {...formProps} />
    </div>
  )
}
