import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 支持的语言列表
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // 获取请求的语言
  let locale = await requestLocale;

  // 验证语言是否支持
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'zh'; // 默认语言
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

