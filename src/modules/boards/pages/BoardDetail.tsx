// Board Details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '../components/BoardBar'
import { mockData } from '~/apis/mock-data'
import { Board as BoardType } from '../types/board'
import BoardContent from '../components/BoardContent'

const boardData = mockData.board as BoardType

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={boardData} />
      <BoardContent board={boardData} />
    </Container>
  )
}

export default Board
