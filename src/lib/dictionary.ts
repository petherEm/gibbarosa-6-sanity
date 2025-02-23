import "server-only"

const LANGUAGE_MAPPINGS: Record<string, string> = {
  pl: 'pl',
  fr: 'fr',
  en: 'en',
  gb: 'en', // Great Britain -> English
  uk: 'en', // United Kingdom -> English
  us: 'en', // United States -> English
  // Add any specific country -> language mappings here
}

type SupportedLocale = 'en' | 'pl' | 'fr';

function getLanguageFromCountryCode(countryCode: string): SupportedLocale {
  // Convert country code to lowercase for consistent lookup
  const code = countryCode.toLowerCase()
  
  // Return the mapped language or fallback to 'en'
  return (LANGUAGE_MAPPINGS[code] || 'en') as SupportedLocale
}

export async function getDictionary(countryCode: string) {
  const locale = getLanguageFromCountryCode(countryCode)
  
  const dictionaries = {
    en: () => import("@/dictionaries/en.json").then((module) => module.default),
    pl: () => import("@/dictionaries/pl.json").then((module) => module.default),
    fr: () => import("@/dictionaries/fr.json").then((module) => module.default),
  }

  const dictionary = await dictionaries[locale]()
  return dictionary
}

