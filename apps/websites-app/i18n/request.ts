import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from '../next-intl.config';

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale
  const validLocale = locale && locales.includes(locale as any) ? locale : defaultLocale;
  
  return {
    messages: (await import(`../messages/${validLocale}.json`)).default,
    locale: validLocale
  };
}); 

 