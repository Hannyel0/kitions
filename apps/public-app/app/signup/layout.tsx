import { generateMetadata as createMetadata, pageMetadata } from '../lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = createMetadata(
  pageMetadata.signup.title,
  pageMetadata.signup.description
);

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 