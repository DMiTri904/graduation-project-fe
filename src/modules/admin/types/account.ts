/**
 * Account Type Definition
 */
export interface Account {
  id: string
  email: string
  fullName: string
  mssv: string
  role: 'Admin' | 'Student'
  status: 'Active' | 'Inactive'
}

/**
 * Mock data for Account Management
 */
export const mockAccounts: Account[] = [
  {
    id: '1',
    email: 'admin@ntu.edu.vn',
    fullName: 'Nguyễn Văn Admin',
    mssv: 'ADMIN001',
    role: 'Admin',
    status: 'Active'
  },
  {
    id: '2',
    email: 'student1@ntu.edu.vn',
    fullName: 'Trần Thị Học Sinh',
    mssv: '63135432',
    role: 'Student',
    status: 'Active'
  },
  {
    id: '3',
    email: 'student2@ntu.edu.vn',
    fullName: 'Lê Văn Minh',
    mssv: '63135433',
    role: 'Student',
    status: 'Active'
  },
  {
    id: '4',
    email: 'student3@ntu.edu.vn',
    fullName: 'Phạm Thị Hương',
    mssv: '63135434',
    role: 'Student',
    status: 'Inactive'
  },
  {
    id: '5',
    email: 'student4@ntu.edu.vn',
    fullName: 'Hoàng Văn Tuấn',
    mssv: '63135435',
    role: 'Student',
    status: 'Active'
  }
]
