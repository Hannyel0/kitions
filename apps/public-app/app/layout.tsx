import "./globals.css";

import { Roboto } from "next/font/google";
import { AuthProvider } from "./providers/auth-provider";
import Script from "next/script";
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const roboto = Roboto({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

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
          <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow pt-16">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
