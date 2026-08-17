import { mockProjects } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './project-detail-client';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = mockProjects.find(p => p.id === id);
  if (!project) notFound();

  // Similar projects matching same category
  const similar = mockProjects.filter(p => p.id !== id && p.category === project.category).slice(0, 3);

  return (
    <ProjectDetailClient project={project} similarProjects={similar} />
  );
}
