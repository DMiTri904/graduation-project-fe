import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import ForgotPasswordPage from '~/modules/auth/pages/forgotPasswordPage'
import { LoginPage } from '~/modules/auth/pages/loginPage'
import BoardDetail from '~/modules/boards/pages/BoardDetail'
import GroupsPage from '~/modules/groups/pages/GroupsPage'
// import GroupDetailPage from '~/modules/groups/pages/GroupDetailPage' // Tạm thời ẩn cái này nếu BoardDetail chính là trang chi tiết nhóm
import AccountManagementPage from '~/modules/admin/pages/AccountManagementPage'
import ResetPasswordPage from '@/modules/auth/pages/resetPasswordPage'
import MyClassesPage from '~/modules/classes/pages/MyClassesPage'
import ClassDetailPage from '~/modules/classes/pages/ClassDetailPage'
import ProfilePage from '~/modules/user/pages/ProfilePage'
import ChangePasswordPage from '~/modules/user/pages/ChangePasswordPage'

export const router = createBrowserRouter([
  // --- PUBLIC ROUTES (Không cần Layout) ---
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

  // --- PROTECTED ROUTES (Có MainLayout) ---
  {
    path: '/',
    element: (
      <MainLayout>
        {/* Vừa vào web sẽ tự động đá sang trang Danh sách dự án */}
        {/* Nếu bạn có Dashboard riêng, thay <Navigate> bằng <DashboardPage /> */}
        <Navigate to='/groups' replace />
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
        {/* Đưa BoardDetail vào đây để nó nhận được cái :id trên thanh địa chỉ */}
        <BoardDetail />
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
