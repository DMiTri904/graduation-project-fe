// Board Details
import BoardBar from '../components/BoardBar'
import BoardContent from '../components/BoardContent'
import GroupSettingsTab from '../components/GroupSettingsTab'
import { useParams } from 'react-router-dom'
import { useGetGroupDetail } from '@/modules/groups/hooks/useGroups'
import { useState } from 'react'
import {
  useBoardDataMapper,
  useBoardRole,
  useGetBoardTasks
} from '../hooks/useBoardHooks'
import { getCurrentUserFromToken } from '@/lib/token'
import { useBoardStore } from '../stores/useBoardStore'

type BoardTab = 'kanban' | 'settings'

function Board() {
  const { id } = useParams<{ id: string }>()
  const groupId = Number(id)
  const [isMyTasksOnly, setIsMyTasksOnly] = useState(false)
  const [activeTab, setActiveTab] = useState<BoardTab>('kanban')
  const currentGroupMembers = useBoardStore(state => state.currentGroupMembers)
  const tokenUser = getCurrentUserFromToken()

  const { data: groupResponse } = useGetGroupDetail(groupId)
  const { data: tasks = [] } = useGetBoardTasks(groupId, isMyTasksOnly)

  const groupDetail = groupResponse?.value

  const currentUserRole = useBoardRole({
    tokenUser,
    currentGroupMembers
  })

  const boardFromApi = useBoardDataMapper({
    groupId,
    groupName: groupDetail?.name,
    groupDescription: groupDetail?.subjectOrProjectName,
    tasks
  })

  return (
    <div className='h-full min-h-0 w-full flex flex-col overflow-hidden'>
      {/* Fixed Board Header */}
      <div className='shrink-0'>
        <BoardBar
          board={boardFromApi}
          groupId={Number.isFinite(groupId) ? groupId : 0}
          groupDetail={groupDetail}
          isMyTasksOnly={isMyTasksOnly}
          onMyTasksOnlyChange={setIsMyTasksOnly}
          onClearFilters={() => setIsMyTasksOnly(false)}
        />
      </div>

      <div className='shrink-0 border-b border-slate-200 bg-white px-6'>
        <div className='flex items-center gap-6 h-12'>
          <button
            type='button'
            onClick={() => setActiveTab('kanban')}
            className={`h-full border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'kanban'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            Bảng công việc
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('settings')}
            className={`h-full border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            Cài đặt
          </button>
        </div>
      </div>

      {activeTab === 'kanban' ? (
        <BoardContent board={boardFromApi} currentUserRole={currentUserRole} />
      ) : (
        <GroupSettingsTab
          groupId={groupId}
          groupDetail={groupDetail}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  )
}

export default Board
