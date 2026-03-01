"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          background: scrolled
            ? "rgba(6, 6, 12, 0.65)"
            : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(200%)" : "blur(8px)",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(200%)" : "blur(8px)",
          borderBottom: scrolled ? "1px solid rgba(59,130,246,0.12)" : "1px solid rgba(255,255,255,0.03)",
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5), 0 0 1px rgba(59,130,246,0.3)" : "none",
        }}>

        {/* Animated gradient border */}
        {scrolled && (
          <div className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none overflow-hidden">
            <div className="absolute inset-0 animate-shimmer"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.6) 25%, rgba(6,182,212,0.6) 50%, rgba(59,130,246,0.6) 75%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}/>
          </div>
        )}

        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-3 group relative">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.4), rgba(6,182,212,0.4))", filter: "blur(8px)", transform: "scale(1.15)" }}/>
                {/* Icon */}
                <div className="relative w-9 h-9 rounded-[10px] flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.95))",
                    boxShadow: "0 4px 16px rgba(59,130,246,0.35), inset 0 1px 1px rgba(255,255,255,0.15)",
                  }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-white text-[20px] tracking-tight">Seedance</span>
                <span className="font-bold text-[20px] tracking-tight"
                  style={{ background: "linear-gradient(135deg, #60a5fa, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  2.0
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink href={`/${locale}`} active={pathname === `/${locale}` || pathname === '/'}>{t('home')}</NavLink>
              <NavLink href={`/${locale}/generator`} active={pathname?.includes('/generator') || pathname?.includes('/dashboard')}>{t('generator')}</NavLink>
              <NavLink href={`/${locale}/api-docs`} active={pathname?.includes('/api-docs')}>{t('apiDocs')}</NavLink>
              <NavLink href={`/${locale}/contact`} active={pathname?.includes('/contact')}>{t('contact')}</NavLink>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              {status === "loading" ? (
                <div className="hidden lg:block w-8 h-8 rounded-full bg-white/10 animate-pulse" />
              ) : session ? (
                /* 已登录 - 显示用户菜单 */
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {((session.user as any)?.name || (session.user as any)?.username || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-white/90 font-medium">
                      {(session.user as any)?.name || (session.user as any)?.username}
                    </span>
                    <svg className={`w-4 h-4 text-white/60 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* 用户下拉菜单 */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-xl py-2 z-50">
                      <Link
                        href={`/${locale}/generator`}
                        className="block px-4 py-2 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        🎬 AI Video
                      </Link>
                      <Link
                        href={`/${locale}/api-keys`}
                        className="block px-4 py-2 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        🔑 API Keys
                      </Link>
                      <hr className="my-2 border-white/10" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // 清除 localStorage 中的 API keys
                          localStorage.removeItem('seedance_api_keys');
                          signOut({ callbackUrl: `/${locale}` });
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 transition-colors"
                      >
                        🚪 退出登录
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* 未登录 - 显示登录/注册按钮 */
                <>
                  <Link
                    href={`/${locale}/login`}
                    className="hidden lg:block px-5 py-2.5 text-[15px] font-semibold text-white/60 hover:text-white/95 transition-all duration-300"
                  >
                    登录
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    className="hidden lg:flex items-center gap-2 px-6 py-3 text-[15px] font-bold rounded-[10px] transition-all duration-300 relative overflow-hidden group/btn"
                    style={{
                      background: "linear-gradient(135deg, rgba(59,130,246,1), rgba(37,99,235,1))",
                      boxShadow: "0 0 20px rgba(59,130,246,0.4), inset 0 1px 1px rgba(255,255,255,0.12)",
                      border: "1px solid rgba(59,130,246,0.5)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = "0 0 32px rgba(59,130,246,0.65), inset 0 1px 1px rgba(255,255,255,0.15)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(59,130,246,0.4), inset 0 1px 1px rgba(255,255,255,0.12)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                      style={{
                        background: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="relative z-10">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    <span className="relative z-10">免费开始</span>
                  </Link>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[10px] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                onClick={() => setMobileOpen(!mobileOpen)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-x-0 top-[68px] z-40 lg:hidden transition-all duration-400 ${mobileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}`}
        style={{
          background: "rgba(6,6,12,0.95)",
          backdropFilter: "blur(32px) saturate(200%)",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}>
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col gap-1.5">
          {[
            { label: t('home'), href: `/${locale}`, active: pathname === `/${locale}` || pathname === '/' },
            { label: t('generator'), href: `/${locale}/generator`, active: pathname?.includes('/generator') || pathname?.includes('/dashboard') },
            { label: t('apiDocs'), href: `/${locale}/api-docs`, active: pathname?.includes('/api-docs') },
            { label: t('contact'), href: `/${locale}/contact`, active: pathname?.includes('/contact') }
          ].map(item => (
            <Link key={item.label} href={item.href}
              className={`px-4 py-3.5 text-[15px] font-semibold rounded-[10px] transition-all duration-300 ${
                item.active ? 'text-white bg-white/[0.08]' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
              style={{ border: item.active ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent" }}
              onMouseEnter={e => !item.active && (e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)")}
              onMouseLeave={e => !item.active && (e.currentTarget.style.borderColor = "transparent")}>
              {item.label}
            </Link>
          ))}
          <div className="mt-3 pt-4 border-t border-white/[0.06] flex gap-3">
            <button className="flex-1 py-3 text-[15px] font-semibold text-white/60 hover:text-white rounded-[10px] border border-white/10 hover:border-white/20 transition-all duration-300">
              {t('signIn')}
            </button>
            <button className="flex-1 py-3 text-[15px] font-bold rounded-[10px] transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,1), rgba(37,99,235,1))",
                boxShadow: "0 0 20px rgba(59,130,246,0.4)",
              }}>
              {t('getStarted')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link href={href}
      className={`relative px-5 py-2.5 text-[15px] rounded-[10px] transition-all duration-300 group/link font-semibold ${
        active ? 'text-white' : 'text-white/60 hover:text-white'
      }`}
      style={{ letterSpacing: "0" }}>
      <span className="relative z-10">{children}</span>
      {/* Active/Hover bg with border */}
      <span className={`absolute inset-0 rounded-[10px] transition-all duration-300 ${
        active ? 'opacity-100' : 'opacity-0 group-hover/link:opacity-100'
      }`}
        style={{
          background: active ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.06)",
          border: "1px solid rgba(59,130,246,0.15)",
          boxShadow: active ? "0 0 16px rgba(59,130,246,0.15)" : "0 0 12px rgba(59,130,246,0.08)",
        }}/>
    </Link>
  );
}

