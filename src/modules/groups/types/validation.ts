import * as yup from 'yup'

/**
 * Create Group Form Schema
 */
export const createGroupSchema = yup.object().shape({
  name: yup
    .string()
    .required('Tên nhóm là bắt buộc')
    .min(3, 'Tên nhóm phải có ít nhất 3 ký tự')
    .max(50, 'Tên nhóm không được quá 50 ký tự'),
  category: yup.string().required('Danh mục là bắt buộc'),
  maxMembers: yup
    .number()
    .min(2, 'Số thành viên tối thiểu là 2')
    .max(20, 'Số thành viên tối đa là 20')
    .default(5)
})

/**
 * Join Group Form Schema
 */
export const joinGroupSchema = yup.object().shape({
  inviteCode: yup
    .string()
    .required('Mã tham gia là bắt buộc')
    .min(3, 'Mã tham gia không hợp lệ')
    .matches(/^[A-Z0-9]+$/, 'Mã tham gia chỉ chứa chữ in hoa và số')
})

export type CreateGroupFormData = yup.InferType<typeof createGroupSchema>
export type JoinGroupFormData = yup.InferType<typeof joinGroupSchema>
