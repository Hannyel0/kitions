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

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kitions",
  "description": "The leading B2B marketplace connecting food distributors and retailers. Streamline your supply chain, discover new products, and grow your business with Kitions.",
  "url": "https://www.kitions.com",
  "logo": "https://www.kitions.com/default.svg",
  "foundingDate": "2024",
  "industry": "Food Distribution",
  "serviceType": "B2B Marketplace",
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "offers": {
    "@type": "Offer",
    "name": "B2B Marketplace Platform",
    "description": "Connect distributors with retailers, manage inventory, and streamline orders"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://www.kitions.com"
  },
  "sameAs": [
    "https://twitter.com/kitions",
    "https://linkedin.com/company/kitions"
  ]
};

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
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
