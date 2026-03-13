/**
 * Student Interface
 */
export interface Student {
  id: string
  mssv: string
  fullName: string
  email: string
  groupId?: string // null nếu chưa vào nhóm
}

/**
 * Group Interface (trong 1 Class)
 */
export interface ClassGroup {
  id: string
  name: string
  classId: string
  memberCount: number
  maxMembers: number
  progress: number // 0-100
  leaderId?: string
}

/**
 * Class Interface (Lớp học)
 */
export interface Class {
  id: string
  name: string
  subject: string
  joinCode: string
  studentCount: number
  maxStudents: number
  groupCount: number
  createdAt: string
  lecturerId: string
}

/**
 * Mock Data - Classes
 */
export const MOCK_CLASSES: Class[] = [
  {
    id: 'class-001',
    name: 'Thực hành Web - Ca 1',
    subject: 'Phát triển ứng dụng Web',
    joinCode: 'WEB2024A',
    studentCount: 45,
    maxStudents: 60,
    groupCount: 8,
    createdAt: '2024-01-15',
    lecturerId: 'lecturer-001'
  },
  {
    id: 'class-002',
    name: 'Lập trình Mobile - Ca 2',
    subject: 'Phát triển ứng dụng Di động',
    joinCode: 'MOBILE24',
    studentCount: 38,
    maxStudents: 50,
    groupCount: 6,
    createdAt: '2024-01-20',
    lecturerId: 'lecturer-001'
  },
  {
    id: 'class-003',
    name: 'Trí tuệ nhân tạo - Ca 3',
    subject: 'Artificial Intelligence',
    joinCode: 'AI2024NTU',
    studentCount: 52,
    maxStudents: 60,
    groupCount: 10,
    createdAt: '2024-02-01',
    lecturerId: 'lecturer-001'
  },
  {
    id: 'class-004',
    name: 'Cloud Computing - Ca 1',
    subject: 'Điện toán đám mây',
    joinCode: 'CLOUD2024',
    studentCount: 30,
    maxStudents: 45,
    groupCount: 5,
    createdAt: '2024-02-10',
    lecturerId: 'lecturer-001'
  }
]

/**
 * Mock Data - Groups (cho 1 class cụ thể)
 */
export const MOCK_GROUPS: ClassGroup[] = [
  {
    id: 'group-001',
    name: 'E-commerce Platform',
    classId: 'class-001',
    memberCount: 5,
    maxMembers: 5,
    progress: 75,
    leaderId: 'student-001'
  },
  {
    id: 'group-002',
    name: 'Social Network App',
    classId: 'class-001',
    memberCount: 4,
    maxMembers: 5,
    progress: 60,
    leaderId: 'student-006'
  },
  {
    id: 'group-003',
    name: 'Learning Management System',
    classId: 'class-001',
    memberCount: 5,
    maxMembers: 5,
    progress: 85,
    leaderId: 'student-011'
  },
  {
    id: 'group-004',
    name: 'Task Management Tool',
    classId: 'class-001',
    memberCount: 4,
    maxMembers: 5,
    progress: 40,
    leaderId: 'student-016'
  },
  {
    id: 'group-005',
    name: 'Online Booking System',
    classId: 'class-001',
    memberCount: 5,
    maxMembers: 5,
    progress: 55,
    leaderId: 'student-021'
  }
]

/**
 * Mock Data - Ungrouped Students (sinh viên chưa vào nhóm)
 */
export const MOCK_UNGROUPED_STUDENTS: Student[] = [
  {
    id: 'student-026',
    mssv: '63135426',
    fullName: 'Nguyễn Văn An',
    email: '63135426@ntu.edu.vn'
  },
  {
    id: 'student-027',
    mssv: '63135427',
    fullName: 'Trần Thị Bình',
    email: '63135427@ntu.edu.vn'
  },
  {
    id: 'student-028',
    mssv: '63135428',
    fullName: 'Lê Hoàng Cường',
    email: '63135428@ntu.edu.vn'
  },
  {
    id: 'student-029',
    mssv: '63135429',
    fullName: 'Phạm Thị Dung',
    email: '63135429@ntu.edu.vn'
  },
  {
    id: 'student-030',
    mssv: '63135430',
    fullName: 'Hoàng Văn Em',
    email: '63135430@ntu.edu.vn'
  }
]

/**
 * Subject Options
 */
export const SUBJECTS = [
  'Phát triển ứng dụng Web',
  'Phát triển ứng dụng Di động',
  'Artificial Intelligence',
  'Machine Learning',
  'Điện toán đám mây',
  'An toàn và Bảo mật',
  'Cơ sở dữ liệu',
  'Mạng máy tính',
  'Phát triển phần mềm',
  'Kiến trúc phần mềm'
] as const

export type Subject = (typeof SUBJECTS)[number]
