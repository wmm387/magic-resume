import { defaultLocale, locales } from './config'
import { createNavigation, defineRouting } from '@/i18n/compat/navigation'

export const routing = defineRouting({
  locales,
  defaultLocale,
})

export const { Link, usePathname } = createNavigation(routing)
