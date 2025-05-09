import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
  // Default to 'en' if locale is undefined
  const resolvedLocale = locale || 'en';
  
  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
}); 