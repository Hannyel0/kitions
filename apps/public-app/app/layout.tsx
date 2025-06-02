import "./globals.css";

import { Roboto } from "next/font/google";
import { AuthProvider } from "./providers/auth-provider";
import Script from "next/script";
import { validateEnv } from './lib/env-validator';
import { defaultMetadata } from './lib/metadata';
import { Metadata } from "next";
import ConditionalLayout from './components/ConditionalLayout';

const roboto = Roboto({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// Validate environment variables
if (typeof window !== 'undefined') {
  // Only run in the browser
  const { valid, messages } = validateEnv();
  
  // Log validation results
  messages.forEach(message => {
    if (message.includes('Missing required')) {
      console.error(message);
    } else {
      console.warn(message);
    }
  });
  
  // Throw error if validation failed (only in development)
  if (!valid && process.env.NODE_ENV === 'development') {
    throw new Error('Missing required environment variables. Check the console for details.');
  }
}

/**
 * Export metadata for the root layout
 */
export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          integrity="sha512-fD9DI5bZwQxOi7MhYWnnNPlvXdp/2Pj3XSTRrFs5FQa4mizyGLnJcN6tuvUS6LbmgN1ut+XGSABKvjN0H6Aoow=="
          crossOrigin="anonymous"
        />
      </head>
      <body className={roboto.className}>
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
