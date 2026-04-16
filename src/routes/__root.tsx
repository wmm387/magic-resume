import { Outlet, createRootRoute } from '@tanstack/react-router'
import { NextIntlClientProvider } from '@/i18n/compat/client'
import zhMessages from '@/i18n/locales/zh.json'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: RootNotFound,
  ssr: false,
})

function RootComponent() {
  return (
    <NextIntlClientProvider
      locale='zh'
      messages={zhMessages}
      timeZone="Asia/Shanghai"
    >
      <Outlet />
      <Toaster position="top-center" richColors />
    </NextIntlClientProvider>
  )
}

function RootNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">页面不存在</p>
    </main>
  )
}
