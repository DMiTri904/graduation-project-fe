// Board Details
import BoardBar from '../components/BoardBar'
import BoardContent from '../components/BoardContent'
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

function Board() {
  const { id } = useParams<{ id: string }>()
  const groupId = Number(id)
  const [isMyTasksOnly, setIsMyTasksOnly] = useState(false)
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
    <div className='h-screen w-full flex flex-col overflow-hidden'>
      {/* Fixed Board Header */}
      <BoardBar
        board={boardFromApi}
        groupId={Number.isFinite(groupId) ? groupId : 0}
        groupDetail={groupDetail}
        isMyTasksOnly={isMyTasksOnly}
        onMyTasksOnlyChange={setIsMyTasksOnly}
        onClearFilters={() => setIsMyTasksOnly(false)}
      />

      {/* Scrollable Board Content - takes remaining height */}
      <BoardContent board={boardFromApi} currentUserRole={currentUserRole} />
    </div>
  )
}

export default Board
