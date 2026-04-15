import { routing } from './i18n/routing.public'
import createMiddleware from '@/i18n/compat/middleware'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(zh|en)/:path*'],
}
