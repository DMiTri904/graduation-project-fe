import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  useDeleteGroup,
  useUpdateGroupGithubRepo,
  useUpdateGroupInfo
} from '@/modules/groups/hooks/useGroups'

interface GroupDetailLike {
  name?: string
  subjectOrProjectName?: string
  repoUrl?: string
}

interface GroupSettingsTabProps {
  groupId: number
  groupDetail?: GroupDetailLike
  currentUserRole: 'Leader' | 'Member' | string
}

export default function GroupSettingsTab({
  groupId,
  groupDetail,
  currentUserRole
}: GroupSettingsTabProps) {
  const navigate = useNavigate()
  const isLeader = currentUserRole === 'Leader'

  const [groupName, setGroupName] = useState('')
  const [subjectOrProjectName, setSubjectOrProjectName] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [isEditingGeneral, setIsEditingGeneral] = useState(false)
  const [isEditingGithub, setIsEditingGithub] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [confirmName, setConfirmName] = useState('')

  const {
    mutateAsync: updateGroupInfoMutateAsync,
    isPending: isUpdatingGroupInfo
  } = useUpdateGroupInfo(groupId)
  const {
    mutateAsync: updateGithubRepoMutateAsync,
    isPending: isUpdatingGithubRepo
  } = useUpdateGroupGithubRepo(groupId)
  const { mutateAsync: deleteGroupMutateAsync, isPending: isDeletingGroup } =
    useDeleteGroup()

  useEffect(() => {
    if (!groupDetail) return

    setGroupName(groupDetail.name || '')
    setSubjectOrProjectName(groupDetail.subjectOrProjectName || '')
    setRepoUrl(groupDetail.repoUrl || '')
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

  return (
    <div className='flex-1 min-h-0 overflow-auto bg-slate-50 p-6'>
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
              <div className='flex items-center gap-3'>
                <Button
                  variant='outline'
                  onClick={handleCancelGeneralEdit}
                  disabled={isUpdatingGroupInfo}
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleSaveGroupInfo}
                  disabled={isUpdatingGroupInfo || groupId <= 0}
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
                  <div className='flex items-center gap-2'>
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
              <div className='flex items-center gap-3'>
                <Button
                  variant='outline'
                  onClick={handleCancelGithubEdit}
                  disabled={isUpdatingGithubRepo}
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleUpdateGithubRepo}
                  disabled={isUpdatingGithubRepo || groupId <= 0}
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
      </div>

      {isLeader && isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
            <h3 className='text-lg font-semibold text-slate-900'>
              Xác nhận xóa nhóm
            </h3>
            <p className='mt-2 text-sm text-slate-600'>
              Vui lòng nhập <strong>{groupDetail?.name || ''}</strong> để xác
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
    </div>
  )
}
