import { mockPackages, mockCreators } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import PackageDetailClient from './package-detail-client';

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = mockPackages.find(p => p.id === id);
  if (!pkg) notFound();

  // Find creator details
  const creator = mockCreators.find(c => c.id === pkg.creatorId || c.name === pkg.creator);

  return (
    <PackageDetailClient pkg={pkg} creator={creator} />
  );
}
