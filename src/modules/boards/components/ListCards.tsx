import CardItem from './Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card } from '../types/board'

interface ListCardsProps {
  cards: Card[]
}

function ListCards({ cards }: ListCardsProps) {
  return (
    <SortableContext
      items={cards?.map(c => c._id)}
      strategy={verticalListSortingStrategy}
    >
      <div className='px-1.5 mx-1.5 flex flex-col gap-2 overflow-x-hidden overflow-y-auto max-h-[calc(100vh-170px-50px-50px)] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400'>
        {cards.map(card => (
          <CardItem key={card._id} card={card} />
        ))}
      </div>
    </SortableContext>
  )
}

export default ListCards
