export type TicketStatus = 'pending' | 'ai_responded' | 'resolved' | string

export function customerStatusLabel(status: TicketStatus) {
  if (status === 'pending') return 'Received'
  if (status === 'ai_responded') return 'Replied'
  if (status === 'resolved') return 'Closed'
  return 'Open'
}

export function adminStatusLabel(status: TicketStatus) {
  if (status === 'pending') return 'New'
  if (status === 'ai_responded') return 'In review'
  if (status === 'resolved') return 'Closed'
  return status
}
