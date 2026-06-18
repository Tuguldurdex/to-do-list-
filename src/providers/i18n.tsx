import { resource as resourceMN } from "@/locales/mn"
import i18n from "i18next"
import { I18nextProvider, initReactI18next } from "react-i18next"

const resources = {
  mn: resourceMN,
}

i18n.use(initReactI18next).init({
  resources,
  lng: "mn",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

export function I18nProvider({ children }: any) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
