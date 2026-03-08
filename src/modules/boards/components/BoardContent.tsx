import ListColumn from './ListColumn'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  Active,
  Over,
  CollisionDetection
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import ColumnItem from './Column'
import CardItem from './Card'
import { generatePlaceholderCard } from '~/utils/formatters'
import type { Board, Column, Card } from '../types/board'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
} as const

type ActiveDragItemType =
  (typeof ACTIVE_DRAG_ITEM_TYPE)[keyof typeof ACTIVE_DRAG_ITEM_TYPE]

interface BoardContentProps {
  board?: Board
}

function BoardContent({ board }: BoardContentProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState<Column[]>([])
  const [activeDragItemId, setActiveDragitemId] = useState<string | null>(null)
  const [activeDragItemType, setActiveDragItemType] =
    useState<ActiveDragItemType | null>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<
    Column | Card | null
  >(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState<Column | null>(null)

  const lastOverId = useRef<string | null>(null)

  useEffect(() => {
    if (board) {
      setOrderedColumns(mapOrder(board.columns, board.columnOrderIds, '_id'))
    }
  }, [board])

  const findColumnByCardId = (cardId: string) => {
    return orderedColumns.find((column: Column) =>
      column?.cards?.map((card: Card) => card._id)?.includes(cardId)
    )
  }

  const moveCardBetweenDifferentColumns = (
    overColumn: Column,
    overCardId: string,
    active: Active,
    over: Over,
    activeColumn: Column,
    activeDraggingCardId: string,
    activeDraggingCardData: Card
  ) => {
    setOrderedColumns(prevColumns => {
      const overCardIndex = overColumn?.cards?.findIndex(
        card => card._id === overCardId
      )

      let newCardIndex: number
      const isBelowOverItem =
        active.rect.current.translated &&
        over.rect &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : (overColumn?.cards?.length || 0) + 1

      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(
        (column: Column) => column._id === activeColumn._id
      )
      const nextOverColumn = nextColumns.find(
        (column: Column) => column._id === overColumn._id
      )

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          card => card._id !== activeDraggingCardId
        )

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          card => card._id
        )
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card: Card) => card._id !== activeDraggingCardId
        )

        const rebuild_activeDraggingCardData: Card = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card: Card) => !card.FE_PlaceholderCard
        )

        nextOverColumn.cards.splice(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card: Card) => card._id
        )
      }
      return nextColumns
    })
  }

  const handleDragStart = (e: DragStartEvent) => {
    setActiveDragitemId(e?.active?.id as string)
    setActiveDragItemType(
      e?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(e?.active?.data?.current as Column | Card)

    if (e?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(
        findColumnByCardId(e?.active?.id as string) || null
      )
    }
  }

  const handleDragOver = (e: DragOverEvent) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = e
    if (!active || !over) return

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId as string)
    const overColumn = findColumnByCardId(overCardId as string)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId as string,
        active,
        over,
        activeColumn,
        activeDraggingCardId as string,
        activeDraggingCardData as Card
      )
    }
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e

    if (!active || !over) return

    if (
      activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD &&
      oldColumnWhenDraggingCard
    ) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId as string)
      const overColumn = findColumnByCardId(overCardId as string)

      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId as string,
          active,
          over,
          activeColumn,
          activeDraggingCardId as string,
          activeDraggingCardData as Card
        )
      } else {
        const oldCardIndex =
          oldColumnWhenDraggingCard?.cards?.findIndex(
            c => c._id === activeDragItemId
          ) ?? -1
        const newCardIndex =
          overColumn?.cards?.findIndex(c => c._id === overCardId) ?? -1

        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards || [],
          oldCardIndex,
          newCardIndex
        )

        setOrderedColumns((prevColumns: Column[]) => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(
            (column: Column) => column._id === overColumn._id
          )

          if (targetColumn) {
            targetColumn.cards = dndOrderedCards
            targetColumn.cardOrderIds = dndOrderedCards.map(
              (card: Card) => card._id
            )
          }

          return nextColumns
        })
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(
          c => c._id === active.id
        )
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        )
        setOrderedColumns(dndOrderedColumns)
      }
    }

    setActiveDragitemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    args => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      const pointerIntersections = pointerWithin(args)
      if (!pointerIntersections?.length) return []

      let overId = getFirstCollision(pointerIntersections, 'id') as string

      if (overId) {
        const checkColumn = orderedColumns.find(
          (column: Column) => column._id === overId
        )

        if (checkColumn) {
          const closestCornersResults = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(container => {
              return (
                container.id !== overId &&
                checkColumn?.cardOrderIds?.includes(container.id as string)
              )
            })
          })

          if (closestCornersResults[0]?.id) {
            overId = closestCornersResults[0].id as string
          }
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* h-[calc(100vh-64px-68px)] */}
      <div className='bg-slate-50 dark:bg-slate-900 w-full h-full overflow-x-auto overflow-y-hidden p-6'>
        <div className='flex items-start gap-6 h-full'>
          <ListColumn columns={orderedColumns} />
        </div>

        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <ColumnItem column={activeDragItemData as Column} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <CardItem card={activeDragItemData as Card} />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default BoardContent
