import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "uilab-core"
import { TanstackProvider } from "./tanstack"
import { ToasterProvider } from "./toaster"
import { I18nProvider } from "./i18n"

export default function ProvidersWrapper() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        <TooltipProvider delayDuration={0}>
          <ToasterProvider richColors />
          <TanstackProvider />
        </TooltipProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
