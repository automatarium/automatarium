import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

// Contains the different locale codes as the key and locale names as the value
export const locales = {
  en: 'English',
  bg: 'Български'
}

// Contains the locale namespaces that are files
const localeNamespaces = [
  'common'
]

i18n.use(Backend).use(initReactI18next).init({
  fallbackLng: 'en',
  supportedLngs: Object.keys(locales),
  defaultNS: localeNamespaces.at(0),
  ns: localeNamespaces,
  debug: true,
  react: {
    useSuspense: true
  },
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  }
})

export default i18n
