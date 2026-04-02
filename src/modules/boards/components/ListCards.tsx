import CardItem from './Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Card } from '../types/board'

interface ListCardsProps {
  cards: Card[]
}

function ListCards({ cards }: ListCardsProps) {
  return (
    <SortableContext
      items={cards?.map(c => c._id)}
      strategy={verticalListSortingStrategy}
    >
      <div className='flex min-w-0 flex-col gap-2 px-1.5 mx-1.5 overflow-x-hidden'>
        {cards.map(card => (
          <CardItem key={card._id} card={card} />
        ))}
      </div>
    </SortableContext>
  )
}

export default ListCards
