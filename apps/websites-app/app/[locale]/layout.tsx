import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Navbar from '../components/Navbar';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;
  
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    // Error ignored as we just want to trigger notFound()
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </NextIntlClientProvider>
  );
}
