import { mockEvents } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import EventDetailClient from './event-detail-client';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = mockEvents.find(e => e.id === id);
  if (!event) notFound();

  // Find similar events
  const similar = mockEvents.filter(e => e.id !== id).slice(0, 3);

  return (
    <EventDetailClient event={event} similarEvents={similar} />
  );
}
