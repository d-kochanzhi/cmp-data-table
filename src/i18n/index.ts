import { createI18n } from 'vue-i18n'
import en from './locales/en'
import ru from './locales/ru'
import de from './locales/de'
import it from './locales/it'
import fr from './locales/fr'
import ja from './locales/ja'

const getBrowserLanguage = () => {
  const browserLang = navigator.language.split('-')[0]
  return ['en', 'ru', 'de', 'it', 'fr', 'ja'].includes(browserLang) ? browserLang : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
    de,
    it,
    fr,
    ja
  }
})

export default i18n 