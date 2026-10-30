import React from 'react';
import { CommunityProvider } from '@/tncc-community/lib/community-context';
import CommunityLayoutWrapper from '@/tncc-community/components/layout/CommunityLayoutWrapper';

export const metadata = {
  title: 'TNCC Community — Tamil Nadu Creators Club',
  description: 'Tamil Nadu’s free member community platform for creators, designers, video editors, and visual artists.',
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommunityProvider>
      <CommunityLayoutWrapper>
        {children}
      </CommunityLayoutWrapper>
    </CommunityProvider>
  );
}
