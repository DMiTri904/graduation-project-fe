import MainLayout from '@/layouts/MainLayout'
import { createBrowserRouter } from 'react-router-dom'
import ForgotPasswordPage from '~/modules/auth/pages/forgotPasswordPage'
import { LoginPage } from '~/modules/auth/pages/loginPage'
import BoardDetail from '~/modules/boards/pages/BoardDetail'
import GroupsPage from '~/modules/groups/pages/GroupsPage'
import GroupDetailPage from '~/modules/groups/pages/GroupDetailPage'
import AccountManagementPage from '~/modules/admin/pages/AccountManagementPage'
import ResetPasswordPage from '@/modules/auth/pages/resetPasswordPage'

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
    path: '/reset-password',
    element: <ResetPasswordPage />
  },
  {
    path: '/',
    element: (
      <MainLayout>
        <BoardDetail />
      </MainLayout>
    )
  },
  {
    path: '/groups',
    element: (
      <MainLayout>
        <GroupsPage />
      </MainLayout>
    )
  },
  {
    path: '/groups/:id',
    element: (
      <MainLayout>
        <GroupDetailPage />
      </MainLayout>
    )
  },
  {
    path: '/account-management',
    element: (
      <MainLayout>
        <AccountManagementPage />
      </MainLayout>
    )
  }
])
