'use client';

import { useEffect } from 'react';
import { TitleController, useTitleController } from '@/app/components/TitleController';

export default function SecretEmailPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TitleController defaultTitle="Secret Email Panel | Kitions">
      {children}
    </TitleController>
  );
}