import { createContext, useContext, useMemo } from 'react'
import { createTranslator } from './utils'
import type { Translator } from './utils'
import type { ReactNode } from 'react'
import type { Locale } from '@/i18n/config'

type Messages = Record<string, unknown>;

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  timeZone?: string;
};

const I18nContext = createContext<I18nContextValue | null>(null)

type ProviderProps = {
  locale: Locale;
  messages: Messages;
  timeZone?: string;
  children: ReactNode;
};

export function NextIntlClientProvider({
  locale,
  messages,
  timeZone,
  children
}: ProviderProps) {
  const value = useMemo(
    () => ({ locale, messages, timeZone }),
    [locale, messages, timeZone]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

function useI18nContext() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('I18n context is not available. Wrap with NextIntlClientProvider.')
  }
  return context
}

export function useLocale() {
  return useI18nContext().locale
}

export function useTranslations(namespace?: string): Translator {
  const { messages } = useI18nContext()
  return useMemo(() => createTranslator(messages, namespace), [messages, namespace])
}

