'use client';

import { TitleController } from '@/app/components/TitleController';

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