import React, { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { getRouter } from './router';
import { NextIntlClientProvider } from './i18n/compat/client';
import { defaultLocale } from './i18n/config';
import zhMessages from './i18n/locales/zh.json';
import enMessages from './i18n/locales/en.json';
import { Toaster } from './components/ui/sonner';
import { useResumeStore } from './store/useResumeStore';

const router = getRouter();

function App() {
  const messages = {
    zh: zhMessages,
    en: enMessages
  };

  const { activeResume, createResume } = useResumeStore();

  // 当没有活动简历时，创建一个默认简历
  useEffect(() => {
    if (!activeResume) {
      createResume();
    }
  }, [activeResume, createResume]);

  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages[defaultLocale]}>
      <RouterProvider router={router}>
        {/* 路由内容将由RouterProvider自动渲染 */}
      </RouterProvider>
    </NextIntlClientProvider>
  );
}

export default App;
