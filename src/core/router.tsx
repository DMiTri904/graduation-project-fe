import MainLayout from '@/layouts/mainLayout'
import { createBrowserRouter } from 'react-router-dom'
import ForgotPasswordPage from '~/modules/auth/pages/forgotPasswordPage'
import { LoginPage } from '~/modules/auth/pages/loginPage'
import ResetPasswordPage from '~/modules/auth/pages/resetPasswordPage'
import BoardDetail from '~/modules/boards/pages/BoardDetail'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },
  {
    path: '/reset',
    element: <ResetPasswordPage />
  },
  {
    path: '/',
    element: (
      <MainLayout>
        <BoardDetail />
      </MainLayout>
    )
  }
])
