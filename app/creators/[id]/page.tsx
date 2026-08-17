import { mockCreators, mockPackages, mockEvents, mockTestimonials } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import CreatorProfileClient from './creator-profile-client';

export default async function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creator = mockCreators.find(c => c.id === id);
  if (!creator) notFound();

  // Find packages offered by this creator
  const packages = mockPackages.filter(p => p.creatorId === id || p.creator === creator.name);

  // Find reviews of type 'creator' (mock reviews)
  const reviews = mockTestimonials.filter(r => r.type === 'creator').slice(0, 3);

  // Find events related to the organizer
  const events = mockEvents.filter(e => e.organizer.toLowerCase().includes(creator.name.toLowerCase().split(' ')[0]));

  return (
    <CreatorProfileClient
      creator={creator}
      packages={packages}
      reviews={reviews}
      events={events}
    />
  );
}
