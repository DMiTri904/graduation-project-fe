// Board Details
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../components/BoardBar'
import { mockData } from '~/apis/mock-data'
import type { Board as BoardType } from '../types/board'
import BoardContent from '../components/BoardContent'

const boardData = mockData.board as BoardType

function Board() {
  return (
    <div className='h-screen w-full flex flex-col overflow-hidden'>
      {/* Fixed Board Header */}
      <BoardBar board={boardData} />

      {/* Scrollable Board Content - takes remaining height */}
      <BoardContent board={boardData} />
    </div>
  )
}

export default Board
