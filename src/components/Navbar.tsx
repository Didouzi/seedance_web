"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          borderBottom: scrolled ? "1px solid rgba(124,58,237,0.12)" : "1px solid rgba(255,255,255,0.03)",
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5), 0 0 1px rgba(124,58,237,0.3)" : "none",
        }}>

        {/* Animated gradient border */}
        {scrolled && (
          <div className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none overflow-hidden">
            <div className="absolute inset-0 animate-shimmer"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.6) 25%, rgba(59,130,246,0.6) 50%, rgba(124,58,237,0.6) 75%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}/>
          </div>
        )}

        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(59,130,246,0.4))", filter: "blur(8px)", transform: "scale(1.15)" }}/>
                {/* Icon */}
                <div className="relative w-9 h-9 rounded-[10px] flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(109,40,217,0.95))",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.35), inset 0 1px 1px rgba(255,255,255,0.15)",
                  }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-white text-[18px] tracking-[-0.02em]">Seedance</span>
                <span className="font-bold text-[18px] tracking-[-0.02em]"
                  style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  2.0
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/generator">Generator</NavLink>
              <NavLink href="/my-creations">My Creations</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Sign in */}
              <button className="hidden lg:block px-4 py-2 text-[13px] font-medium text-white/50 hover:text-white/90 transition-all duration-300">
                Sign in
              </button>
              {/* Try Free */}
              <button
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-[10px] transition-all duration-300 relative overflow-hidden group/btn"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,1), rgba(109,40,217,1))",
                  boxShadow: "0 0 20px rgba(124,58,237,0.4), inset 0 1px 1px rgba(255,255,255,0.12)",
                  border: "1px solid rgba(124,58,237,0.5)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 0 32px rgba(124,58,237,0.65), inset 0 1px 1px rgba(255,255,255,0.15)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(124,58,237,0.4), inset 0 1px 1px rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                  }}/>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="relative z-10">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <span className="relative z-10">Try Free</span>
              </button>

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
          borderBottom: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}>
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col gap-1.5">
          {[
            { label: "Home", href: "/" },
            { label: "Generator", href: "/generator" },
            { label: "My Creations", href: "/my-creations" },
            { label: "Pricing", href: "/pricing" }
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="px-4 py-3.5 text-[14px] text-white/60 hover:text-white hover:bg-white/[0.04] rounded-[10px] transition-all duration-300"
              style={{ border: "1px solid transparent" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.15)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}>
              {item.label}
            </Link>
          ))}
          <div className="mt-3 pt-4 border-t border-white/[0.06] flex gap-3">
            <button className="flex-1 py-3 text-[13px] font-medium text-white/60 hover:text-white rounded-[10px] border border-white/10 hover:border-white/20 transition-all duration-300">
              Sign in
            </button>
            <button className="flex-1 py-3 text-[13px] font-semibold rounded-[10px] transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,1), rgba(109,40,217,1))",
                boxShadow: "0 0 20px rgba(124,58,237,0.4)",
              }}>
              Try Free
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href}
      className="relative px-4 py-2.5 text-[13px] text-white/55 hover:text-white rounded-[10px] transition-all duration-300 group/link font-medium"
      style={{ letterSpacing: "-0.01em" }}>
      <span className="relative z-10">{children}</span>
      {/* Hover bg with border */}
      <span className="absolute inset-0 rounded-[10px] opacity-0 group-hover/link:opacity-100 transition-all duration-300"
        style={{
          background: "rgba(124,58,237,0.06)",
          border: "1px solid rgba(124,58,237,0.15)",
          boxShadow: "0 0 12px rgba(124,58,237,0.08)",
        }}/>
    </a>
  );
}

