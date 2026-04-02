import { useParams } from 'react-router-dom'
import { useGroupContribution } from '@/modules/groups/hooks/useGroupContribution'

const ContributionTable = () => {
  const { id, groupId } = useParams<{ id?: string; groupId?: string }>()
  const resolvedGroupId = groupId || id

  const { data, isLoading, isError, error } =
    useGroupContribution(resolvedGroupId)

  const rows = Array.isArray(data?.value) ? data.value : []

  if (isLoading) {
    return (
      <div className='animate-pulse rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600'>
        Đang tải dữ liệu...
      </div>
    )
  }

  if (isError) {
    return (
      <div className='rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600'>
        {(error as Error)?.message || 'Không thể tải dữ liệu đóng góp'}
      </div>
    )
  }

  if (!resolvedGroupId) {
    return (
      <div className='rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700'>
        Không tìm thấy mã nhóm để tải thống kê.
      </div>
    )
  }

  return (
    <div className='w-full overflow-x-auto rounded-md border border-slate-200'>
      <table className='min-w-full divide-y divide-slate-200 text-sm'>
        <thead className='bg-slate-100'>
          <tr>
            <th className='px-4 py-3 text-left font-semibold text-slate-700'>
              Thành viên
            </th>
            <th className='px-4 py-3 text-left font-semibold text-slate-700'>
              Tài khoản GitHub
            </th>
            <th className='px-4 py-3 text-center font-semibold text-slate-700'>
              Số Commits
            </th>
            <th className='px-4 py-3 text-center font-semibold text-slate-700'>
              Tổng Contributions
            </th>
          </tr>
        </thead>

        <tbody className='divide-y divide-slate-200 bg-white'>
          {rows.length > 0 ? (
            rows.map((item, index) => (
              <tr key={`${item.userName}-${index}`}>
                <td className='px-4 py-3 text-slate-800'>{item.userName}</td>
                <td className='px-4 py-3'>
                  {item.githubUserName ? (
                    <a
                      href={`https://github.com/${item.githubUserName}`}
                      target='_blank'
                      rel='noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      {item.githubUserName}
                    </a>
                  ) : (
                    <span className='inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600'>
                      Chưa liên kết
                    </span>
                  )}
                </td>
                <td className='px-4 py-3 text-center text-slate-800'>
                  {item.totalCommit}
                </td>
                <td className='px-4 py-3 text-center text-slate-800'>
                  {item.totalContribution}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className='px-4 py-6 text-center text-slate-500'>
                Chưa có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ContributionTable
