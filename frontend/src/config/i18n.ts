import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonEN from 'public/locales/en/common.json'
import commonBG from 'public/locales/bg/common.json'

i18n.use(initReactI18next)
  .init({
  fallbackLng: 'en',
  resources: {
    en: {
      common: commonEN
    },
    bg: {
      common: commonBG
    }
  },
  interpolation: {
    escapeValue: false
  },
  debug: true
})

export default i18n
