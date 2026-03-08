// Board Details
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../components/BoardBar'
import { mockData } from '~/apis/mock-data'
import type { Board as BoardType } from '../types/board'
import BoardContent from '../components/BoardContent'

const boardData = mockData.board as BoardType

function Board() {
  return (
    <div className='h-screen w-full'>
      <BoardBar board={boardData} />
      <BoardContent board={boardData} />
    </div>
  )
}

export default Board
