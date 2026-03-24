import { useMemo } from 'react'
import { mockData } from '~/apis/mock-data'
import { generatePlaceholderCard } from '~/utils/formatters'
import {
  mapPriorityToCard,
  mapTaskStatusToColumnId
} from '~/utils/boardFormatters'
import type { Board as BoardType, Card, Column } from '../types/board'
import type { TaskDto } from '../api/task.api'

const boardData = mockData.board as BoardType

interface UseBoardDataMapperParams {
  groupId: number
  groupName?: string
  groupDescription?: string
  tasks: TaskDto[]
}

export const useBoardDataMapper = ({
  groupId,
  groupName,
  groupDescription,
  tasks
}: UseBoardDataMapperParams): BoardType => {
  return useMemo(() => {
    const safeGroupId = Number.isFinite(groupId) && groupId > 0 ? groupId : 0
    const boardId = `group-${safeGroupId || 'unknown'}`

    const columnSeed: Record<string, Column> = {
      todo: {
        _id: 'todo',
        boardId,
        title: 'To Do',
        cardOrderIds: [],
        cards: []
      },
      inprogress: {
        _id: 'inprogress',
        boardId,
        title: 'In Progress',
        cardOrderIds: [],
        cards: []
      },
      test: {
        _id: 'test',
        boardId,
        title: 'Test',
        cardOrderIds: [],
        cards: []
      },
      complete: {
        _id: 'complete',
        boardId,
        title: 'Complete',
        cardOrderIds: [],
        cards: []
      }
    }

    tasks.forEach(task => {
      const columnId = mapTaskStatusToColumnId(task.status)
      const targetColumn = columnSeed[columnId]
      const cardId = `task-${task.id}`

      const card: Card = {
        _id: cardId,
        boardId,
        columnId,
        title: task.title,
        description: task.description ?? null,
        priority: mapPriorityToCard(task.priority),
        assignedTo:
          typeof task.assignedTo === 'number' ? task.assignedTo : null,
        dueDate: task.dueDate ?? undefined,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }

      targetColumn.cards.push(card)
      targetColumn.cardOrderIds.push(cardId)
    })

    const columns: Column[] = ['todo', 'inprogress', 'test', 'complete'].map(
      key => {
        const column = columnSeed[key]
        if (column.cards.length > 0) {
          return column
        }

        const placeholderCard = generatePlaceholderCard(column)
        return {
          ...column,
          cards: [placeholderCard],
          cardOrderIds: [placeholderCard._id]
        }
      }
    )

    return {
      _id: boardId,
      title: groupName || boardData.title,
      description: groupDescription || boardData.description,
      type: 'private',
      ownerIds: [],
      memberIds: [],
      columnOrderIds: columns.map(column => column._id),
      columns
    }
  }, [groupDescription, groupId, groupName, tasks])
}
