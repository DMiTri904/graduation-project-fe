import Box from '@mui/material/Box'
import ListColumn from './ListColumns/ListColumn'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
  // closestCenter
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors#usesensor
  // Nếu dùng PointerSensor mặc đinh thì phải kết hợp thuộc tính CSS touch-action: none ở những phần tử kéo thả - Những mà còn bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Yêu cầu chuột di chuyển 18px thì mới kích hoạt evemt, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })

  // Nhấn giữ 250ms và dung sai của cảm ứng (dễ hiểu là di chuyển/ chênh lệch 500px
  // ) thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })

  // Ưu tiên sử dụng kêt hợp 2 loại sensor là mouse và touch để có trải nghiệm trên mobile tốt nhấtm không bị bug
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  //Cùng một thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragitemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)

  // Điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm)- video 37
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm một cái Column theo CardId
  const findColumnByCardId = cardId => {
    //Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới.
    return orderedColumns.find(column =>
      column?.cards?.map(card => card._id)?.includes(cardId)
    )
  }

  // Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(
        card => card._id === overCardId
      )

      // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(
        column => column._id === activeColumn._id
      )
      const nextOverColumn = nextColumns.find(
        column => column._id === overColumn._id
      )

      // nextActiveColumn: Column cũ
      if (nextActiveColumn) {
        // Xóa card ở cái column active (cũng có thể hiểu là column cũ, cái mà kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          card => card._id !== activeDraggingCardId
        )

        // Thêm Placeholder Card nếu Column rỗng: Bị kéo hết Card đi, không còn cái nào nữa
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          card => card._id
        )
      }

      // nextOverColumn: Column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          card => card._id !== activeDraggingCardId
        )

        // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Xóa Placeholder Card đi nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(
          card => !card.FE_PlaceholderCard
        )

        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
    })
  }

  //Trigger khi bắt đầu kéo 1 phần tử
  const handleDragStart = e => {
    // console.log('handleDragStart: ', e)
    setActiveDragitemId(e?.active?.id)
    setActiveDragItemType(
      e?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(e?.active?.data?.current)

    // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (e?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(e?.active?.id))
    }
  }

  // Trigger trong quá trình kéo(drag) một phần tử
  const handleDragOver = e => {
    // Không làm gì thêm nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    //Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    // console.log('handleDragOver', e)
    const { active, over } = e

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return

    // activeDraggingCardId: là các card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
    const { id: overCardId } = over

    //Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // console.log('activeColumn: ', activeColumn)
    // console.log('overColumn: ', overColumn)

    //Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì sẽ không làm gì
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý kéo xong xuôi thì nó là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  //Trigger khi kết thúc hành động kéo 1 phần tử
  const handleDragEnd = e => {
    // console.log('handleDragEnd', e)
    const { active, over } = e

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return

    // Xử lý kéo thả Cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId: là các card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
      const { id: overCardId } = over

      //Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      //Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return

      // Hành động kéo thả card giữa 2 column khác nhau
      // Phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật 1 lần rồi
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo thả card trong cùng một cái column

        // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          c => c._id === activeDragItemId
        )
        // Lấy vị trí mới (từ thằng active)
        const newCardIndex = overColumn?.cards?.findIndex(
          c => c._id === overCardId
        )

        // Dùng arrayMove vì kéo card trong một cái column thì tương tự với logic kéo column trong 1 cái board content
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        )

        setOrderedColumns(prevColumns => {
          // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns)

          // Tìm tới cái Column mà chúng ta đang thả
          const targetColumn = nextColumns.find(
            column => column._id === overColumn._id
          )
          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          // Trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })
      }
    }

    // Xử lý kéo thả Columns trong board Content
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy vị trí cũ (từ thằng active)
        const oldColumnIndex = orderedColumns.findIndex(
          c => c._id === active.id
        )
        // Lấy vị trí mới (từ thằng active)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng Columns ban đầu
        // Code của arrayMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        )
        // 2 cái console.log dữ liệu này sau dùng để xử lý gọi API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns:', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds:', dndOrderedColumnsIds)

        // Cập nhật lại state columns ban đầu sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // Những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragitemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  // Animation khi thả phần tử - Test bằng cách kéo xong thả trực tiếp và nhìn phần giữ chỗ Overplay (Video 32)
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  // Custom lại chiến lược / thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa nhiều columns
  // args = arguments = Các đối số, tham số
  const collisionDetectionStrategy = useCallback(
    args => {
      // Trường hợp kéo column thì dùng thuật toán closestCorners là chuẩn nhất
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      // Tìm các điểm giao nhau, va chạm - intersections với con trỏ
      const pointerIntersections = pointerWithin(args)

      // Video 37.1: Nếu pointerIntersections là mảng rỗng, return luôn k làm gì hết
      // Fix triệt để cái bug flickering của thư viện Dnd-kit trong trường hợp sau:
      // - Kéo một cái card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả
      if (!pointerIntersections?.length) return

      // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây (k cần bước này nữa - video 37.1)
      // const intersections = !!pointerIntersections?.length
      //   ? pointerIntersections
      //   : rectIntersection(args)

      // Tìm overId đầu tiên trong đám intersections ở trên
      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        // Video 37: đoạn này để fix flickering
        // Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được. Tuy nhiên ở đây dùng closestCorners mượt hơn

        const checkColumn = orderedColumns.find(column => column._id === overId)

        if (checkColumn) {
          // console.log('overId before', overId)
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(container => {
              return (
                container.id !== overId &&
                checkColumn?.cardOrderIds?.includes(container.id)
              )
            })
          })[0]?.id
          // console.log('overId after', overId)
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )
  return (
    <DndContext
      //Cảm biến (video 30)
      sensors={sensors}
      // Thuật toán phát hiện va chạm ( nếu không có nó thì card với cover lớn sẽ không kéo qua Column được vì lúc này nó đang bị confict giữa card và column), chúng ta sẽ dùng closestCorner thay vì closestCenter
      // collisionDetection={closestCorners}

      // Tự custom nâng cao thuật toán phát hiện va chạm
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: theme =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: theme => theme.trello.boardContentHeight,
          display: 'flex',
          p: '10px 0'
        }}
      >
        <ListColumn columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
