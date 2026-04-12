import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  useDeactivateGroup,
  useDeleteGroup,
  useReactiveGroup,
  useUpdateGroupGithubRepo,
  useUpdateGroupInfo
} from '@/modules/groups/hooks/useGroups'

interface GroupDetailLike {
  name?: string
  subjectOrProjectName?: string
  repoUrl?: string
  githubRepoUrl?: string
  isActive?: boolean
}

interface GroupSettingsTabProps {
  groupId: number
  groupDetail?: GroupDetailLike
  groupRole: 'Leader' | 'Member' | string
  systemRole: string
  reloadGroupData?: () => Promise<void> | void
}

export default function GroupSettingsTab({
  groupId,
  groupDetail,
  groupRole,
  systemRole,
  reloadGroupData
}: GroupSettingsTabProps) {
  const navigate = useNavigate()
  const isLeader = groupRole === 'Leader'
  const canManageActiveStatus =
    groupRole === 'Leader' || systemRole === 'Teacher'

  const [groupName, setGroupName] = useState('')
  const [subjectOrProjectName, setSubjectOrProjectName] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [isEditingGeneral, setIsEditingGeneral] = useState(false)
  const [isEditingGithub, setIsEditingGithub] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)
  const [confirmName, setConfirmName] = useState('')

  const {
    mutateAsync: updateGroupInfoMutateAsync,
    isPending: isUpdatingGroupInfo
  } = useUpdateGroupInfo(groupId)
  const {
    mutateAsync: updateGithubRepoMutateAsync,
    isPending: isUpdatingGithubRepo
  } = useUpdateGroupGithubRepo(groupId)
  const { mutateAsync: deactivateGroupMutateAsync } =
    useDeactivateGroup(groupId)
  const { mutateAsync: reactiveGroupMutateAsync } = useReactiveGroup(groupId)
  const { mutateAsync: deleteGroupMutateAsync, isPending: isDeletingGroup } =
    useDeleteGroup()
  const [isUpdatingActiveStatus, setIsUpdatingActiveStatus] = useState(false)

  useEffect(() => {
    if (!groupDetail) return

    const resolvedRepoUrl =
      groupDetail.githubRepoUrl || groupDetail.repoUrl || ''

    setGroupName(groupDetail.name || '')
    setSubjectOrProjectName(groupDetail.subjectOrProjectName || '')
    setRepoUrl(resolvedRepoUrl)
  }, [groupDetail])

  const handleSaveGroupInfo = async () => {
    await updateGroupInfoMutateAsync({
      name: groupName.trim(),
      subjectOrProjectName: subjectOrProjectName.trim()
    })

    setIsEditingGeneral(false)
  }

  const handleUpdateGithubRepo = async () => {
    await updateGithubRepoMutateAsync({
      repoUrl: repoUrl.trim()
    })

    setIsEditingGithub(false)
  }

  const handleCancelGeneralEdit = () => {
    if (groupDetail) {
      setGroupName(groupDetail.name || '')
      setSubjectOrProjectName(groupDetail.subjectOrProjectName || '')
    }

    setIsEditingGeneral(false)
  }

  const handleCancelGithubEdit = () => {
    if (groupDetail) {
      setRepoUrl(groupDetail.repoUrl || '')
    }

    setIsEditingGithub(false)
  }

  const handleOpenDeleteModal = () => {
    setConfirmName('')
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    if (isDeletingGroup) return

    setIsDeleteModalOpen(false)
    setConfirmName('')
  }

  const handleConfirmDeleteGroup = async () => {
    if (!groupDetail?.name) return
    if (confirmName !== groupDetail.name) return

    try {
      await deleteGroupMutateAsync(String(groupId))
      setIsDeleteModalOpen(false)
      setConfirmName('')
      toast.success('Đã xóa nhóm thành công!')
      navigate('/groups')
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          'Không thể xóa nhóm. Vui lòng thử lại.'
      )
    }
  }

  const canConfirmDelete = useMemo(
    () =>
      !!groupDetail?.name &&
      confirmName === groupDetail.name &&
      !isDeletingGroup,
    [confirmName, groupDetail?.name, isDeletingGroup]
  )

  const normalizedRepoUrl = useMemo(() => repoUrl.trim(), [repoUrl])
  const safeRepoHref = useMemo(() => {
    if (!normalizedRepoUrl) return ''
    if (
      normalizedRepoUrl.startsWith('http://') ||
      normalizedRepoUrl.startsWith('https://')
    ) {
      return normalizedRepoUrl
    }

    return `https://${normalizedRepoUrl}`
  }, [normalizedRepoUrl])

  const handleCopyRepoLink = async () => {
    if (!normalizedRepoUrl) return

    try {
      await navigator.clipboard.writeText(normalizedRepoUrl)
      toast.success('Đã copy link GitHub')
    } catch {
      toast.error('Không thể copy link. Vui lòng thử lại.')
    }
  }

  const handleToggleActiveStatus = async () => {
    if (!canManageActiveStatus || groupId <= 0) return

    const isActive = groupDetail?.isActive !== false

    if (isActive) {
      setIsDeactivateModalOpen(true)
      return
    }

    try {
      setIsUpdatingActiveStatus(true)
      await reactiveGroupMutateAsync()
      toast.success('Đã kích hoạt lại nhóm thành công!')
      await reloadGroupData?.()
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          'Không thể cập nhật trạng thái nhóm. Vui lòng thử lại.'
      )
    } finally {
      setIsUpdatingActiveStatus(false)
    }
  }

  const handleConfirmDeactivateGroup = async () => {
    if (!canManageActiveStatus || groupId <= 0) return

    try {
      setIsUpdatingActiveStatus(true)
      await deactivateGroupMutateAsync()
      toast.success('Đã vô hiệu hóa nhóm thành công!')
      setIsDeactivateModalOpen(false)
      await reloadGroupData?.()
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          'Không thể cập nhật trạng thái nhóm. Vui lòng thử lại.'
      )
    } finally {
      setIsUpdatingActiveStatus(false)
    }
  }

  return (
    <div className='flex-1 min-h-0 overflow-auto bg-slate-50 p-3 md:p-6'>
      <div className='mx-auto w-full max-w-4xl space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt thông tin nhóm</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='group-name'>Tên nhóm</Label>
              <Input
                id='group-name'
                value={groupName}
                onChange={event => setGroupName(event.target.value)}
                placeholder='Nhập tên nhóm'
                disabled={!isLeader || !isEditingGeneral || isUpdatingGroupInfo}
                className='disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-default'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='group-subject'>Môn học / Dự án</Label>
              <Input
                id='group-subject'
                value={subjectOrProjectName}
                onChange={event => setSubjectOrProjectName(event.target.value)}
                placeholder='Nhập môn học hoặc tên dự án'
                disabled={!isLeader || !isEditingGeneral || isUpdatingGroupInfo}
                className='disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-default'
              />
            </div>

            {isLeader && !isEditingGeneral ? (
              <Button
                variant='outline'
                onClick={() => setIsEditingGeneral(true)}
                disabled={groupId <= 0 || isUpdatingGroupInfo}
              >
                Chỉnh sửa
              </Button>
            ) : isLeader ? (
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
                <Button
                  variant='outline'
                  onClick={handleCancelGeneralEdit}
                  disabled={isUpdatingGroupInfo}
                  className='w-full sm:w-auto'
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleSaveGroupInfo}
                  disabled={isUpdatingGroupInfo || groupId <= 0}
                  className='w-full sm:w-auto'
                >
                  {isUpdatingGroupInfo ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cài đặt GitHub Repository</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {isLeader ? (
              <div className='space-y-2'>
                <Label htmlFor='group-repo-url'>GitHub Repo URL</Label>
                <Input
                  id='group-repo-url'
                  value={repoUrl}
                  onChange={event => setRepoUrl(event.target.value)}
                  placeholder='https://github.com/org/repo'
                  disabled={!isEditingGithub || isUpdatingGithubRepo}
                  className='disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-default'
                />
              </div>
            ) : (
              <div className='space-y-2'>
                <Label>GitHub Repo URL</Label>
                {normalizedRepoUrl ? (
                  <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
                    <a
                      href={safeRepoHref}
                      target='_blank'
                      rel='noreferrer'
                      className='truncate text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline'
                      title={normalizedRepoUrl}
                    >
                      {normalizedRepoUrl}
                    </a>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={handleCopyRepoLink}
                      className='w-full sm:w-auto'
                    >
                      Copy
                    </Button>
                  </div>
                ) : (
                  <Input
                    value=''
                    placeholder='Chưa có GitHub Repo URL'
                    disabled
                    className='disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-default'
                  />
                )}
              </div>
            )}

            {isLeader && !isEditingGithub ? (
              <Button
                variant='outline'
                onClick={() => setIsEditingGithub(true)}
                disabled={groupId <= 0 || isUpdatingGithubRepo}
              >
                Chỉnh sửa
              </Button>
            ) : isLeader ? (
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
                <Button
                  variant='outline'
                  onClick={handleCancelGithubEdit}
                  disabled={isUpdatingGithubRepo}
                  className='w-full sm:w-auto'
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleUpdateGithubRepo}
                  disabled={isUpdatingGithubRepo || groupId <= 0}
                  className='w-full sm:w-auto'
                >
                  {isUpdatingGithubRepo ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {isLeader && (
          <div className='rounded-lg border border-red-200 bg-white p-5'>
            <h3 className='text-base font-semibold text-red-700'>
              Khu vực nguy hiểm
            </h3>
            <p className='mt-2 text-sm text-slate-600'>
              Thao tác này không thể hoàn tác. Toàn bộ dữ liệu của nhóm sẽ bị
              xóa.
            </p>
            <Button
              type='button'
              className='mt-4 bg-red-600 text-white hover:bg-red-700'
              onClick={handleOpenDeleteModal}
              disabled={groupId <= 0 || isDeletingGroup}
            >
              Xóa nhóm
            </Button>
          </div>
        )}

        {canManageActiveStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái hoạt động nhóm</CardTitle>
            </CardHeader>
            <CardContent>
              {groupDetail?.isActive !== false ? (
                <Button
                  type='button'
                  className='bg-red-600 text-white hover:bg-red-700'
                  disabled={isUpdatingActiveStatus || groupId <= 0}
                  onClick={handleToggleActiveStatus}
                >
                  {isUpdatingActiveStatus
                    ? 'Đang xử lý...'
                    : 'Vô hiệu hóa nhóm'}
                </Button>
              ) : (
                <Button
                  type='button'
                  className='bg-green-600 text-white hover:bg-green-700'
                  disabled={isUpdatingActiveStatus || groupId <= 0}
                  onClick={handleToggleActiveStatus}
                >
                  {isUpdatingActiveStatus
                    ? 'Đang xử lý...'
                    : 'Kích hoạt lại nhóm'}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {isLeader && isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
            <h3 className='text-lg font-semibold text-slate-900'>
              Xác nhận xóa nhóm
            </h3>
            <p className='mt-2 text-sm text-slate-600'>
              Vui lòng nhập <strong>"{groupDetail?.name || ''}"</strong> để xác
              nhận.
            </p>

            <div className='mt-4 space-y-2'>
              <Label htmlFor='confirm-delete-group-name'>Tên nhóm</Label>
              <Input
                id='confirm-delete-group-name'
                value={confirmName}
                onChange={event => setConfirmName(event.target.value)}
                placeholder='Nhập chính xác tên nhóm'
                disabled={isDeletingGroup}
                className='disabled:cursor-default'
              />
            </div>

            <div className='mt-6 flex items-center justify-end gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCloseDeleteModal}
                disabled={isDeletingGroup}
              >
                Hủy
              </Button>
              <Button
                type='button'
                className='bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
                onClick={handleConfirmDeleteGroup}
                disabled={!canConfirmDelete}
              >
                {isDeletingGroup ? 'Đang xóa...' : 'Xác nhận xóa'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog
        open={isDeactivateModalOpen}
        onOpenChange={open => {
          if (isUpdatingActiveStatus) return
          setIsDeactivateModalOpen(open)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận vô hiệu hóa nhóm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn khóa nhóm? Mọi thành viên sẽ không thể chỉnh
              sửa task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatingActiveStatus}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={event => {
                event.preventDefault()
                void handleConfirmDeactivateGroup()
              }}
              disabled={isUpdatingActiveStatus}
              className='bg-red-600 text-white hover:bg-red-700'
            >
              {isUpdatingActiveStatus ? 'Đang xử lý...' : 'Xác nhận'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
