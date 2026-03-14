import MainLayout from '@/layouts/MainLayout'
import { createBrowserRouter } from 'react-router-dom'
import ForgotPasswordPage from '~/modules/auth/pages/forgotPasswordPage'
import { LoginPage } from '~/modules/auth/pages/loginPage'
import BoardDetail from '~/modules/boards/pages/BoardDetail'
import GroupsPage from '~/modules/groups/pages/GroupsPage'
import GroupDetailPage from '~/modules/groups/pages/GroupDetailPage'
import AccountManagementPage from '~/modules/admin/pages/AccountManagementPage'
import ResetPasswordPage from '@/modules/auth/pages/resetPasswordPage'
import MyClassesPage from '~/modules/classes/pages/MyClassesPage'
import ClassDetailPage from '~/modules/classes/pages/ClassDetailPage'
import ProfilePage from '~/modules/user/pages/ProfilePage'
import ChangePasswordPage from '~/modules/user/pages/ChangePasswordPage'

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
    path: '/classes',
    element: (
      <MainLayout>
        <MyClassesPage />
      </MainLayout>
    )
  },
  {
    path: '/classes/:id',
    element: (
      <MainLayout>
        <ClassDetailPage />
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
  },
  {
    path: '/profile',
    element: (
      <MainLayout>
        <ProfilePage />
      </MainLayout>
    )
  },
  {
    path: '/change-password',
    element: (
      <MainLayout>
        <ChangePasswordPage />
      </MainLayout>
    )
  }
])
