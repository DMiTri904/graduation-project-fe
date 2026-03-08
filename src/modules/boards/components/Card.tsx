import { Users, MessageSquare, Paperclip } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Card as CardType } from '../types/board'

interface CardProps {
  card: CardType
}

function TrelloCard({ card }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '2px solid #10b981' : undefined
  }

  const shouldShowCardActions = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    )
  }

  // Don't render placeholder cards at all
  if (card?.FE_PlaceholderCard) {
    return (
      <div
        ref={setNodeRef}
        style={{ display: 'none' }}
        {...attributes}
        {...listeners}
      />
    )
  }

  return (
    <Card
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      className='cursor-pointer shadow-sm hover:shadow-md transition-shadow'
    >
      {card?.cover && (
        <div className='h-36 w-full overflow-hidden rounded-t-lg'>
          <img
            src={card.cover}
            alt={card.title}
            className='w-full h-full object-cover'
          />
        </div>
      )}
      <CardContent className='p-3'>
        <p className='text-sm'>{card?.title}</p>
      </CardContent>
      {shouldShowCardActions() && (
        <CardFooter className='p-2 pt-0 flex gap-2'>
          {!!card?.memberIds?.length && (
            <Badge variant='secondary' className='text-xs gap-1'>
              <Users className='h-3 w-3' />
              {card.memberIds.length}
            </Badge>
          )}
          {!!card?.comments?.length && (
            <Badge variant='secondary' className='text-xs gap-1'>
              <MessageSquare className='h-3 w-3' />
              {card.comments.length}
            </Badge>
          )}
          {!!card?.attachments?.length && (
            <Badge variant='secondary' className='text-xs gap-1'>
              <Paperclip className='h-3 w-3' />
              {card.attachments.length}
            </Badge>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default TrelloCard
