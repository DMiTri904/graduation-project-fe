// Board Details
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../components/BoardBar'
import { mockData } from '~/apis/mock-data'
import type { Board as BoardType } from '../types/board'
import BoardContent from '../components/BoardContent'
import { useParams } from 'react-router-dom'
import { useGetGroupDetail } from '@/modules/groups/hooks/useGroups'

const boardData = mockData.board as BoardType

function Board() {
  const { id } = useParams<{ id: string }>()
  const groupId = Number(id)

  const { data: groupResponse } = useGetGroupDetail(groupId)

  const groupDetail = groupResponse?.value

  return (
    <div className='h-screen w-full flex flex-col overflow-hidden'>
      {/* Fixed Board Header */}
      <BoardBar
        board={boardData}
        groupId={Number.isFinite(groupId) ? groupId : 0}
        groupDetail={groupDetail}
      />

      {/* Scrollable Board Content - takes remaining height */}
      <BoardContent board={boardData} />
    </div>
  )
}

export default Board
