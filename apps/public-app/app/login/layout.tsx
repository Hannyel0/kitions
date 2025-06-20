import { generateMetadata as createMetadata, pageMetadata } from '../lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = createMetadata(
  pageMetadata.login.title,
  pageMetadata.login.description
);

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 