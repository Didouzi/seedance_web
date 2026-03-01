import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { locales } from './i18n';

// 创建 i18n 中间件
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'zh',
  localeDetection: true,
  localePrefix: 'always' // 所有语言都使用前缀
});

// 需要登录才能访问的路径
const protectedPaths = ['/generator', '/api-keys', '/my-creations'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some(path =>
    pathname.includes(path)
  );

  // 如果是受保护的路径,检查登录状态
  if (isProtectedPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // 未登录,重定向到登录页
      const locale = pathname.split('/')[1];
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 执行 i18n 中间件
  return intlMiddleware(request);
}

export const config = {
  // 匹配所有路径，除了 api、_next、静态资源、视频等
  matcher: ['/((?!api|_next|videos|.*\\..*).*)']
};

