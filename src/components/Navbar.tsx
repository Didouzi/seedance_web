"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl"
      style={{ background: "rgba(10, 10, 15, 0.85)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-purple-blue flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-white text-lg">Seedance 2.0</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="#">Image to Video</NavLink>
            <NavLink href="#">Text to Video</NavLink>
            <NavLink href="#">Models & Tools</NavLink>
            <NavLink href="#">Pricing</NavLink>
            <NavLink href="#">Blog</NavLink>
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button className="hidden md:block btn-primary px-4 py-2 text-sm">
              Try Free
            </button>
            <button
              className="md:hidden text-white/70 hover:text-white p-1"
              onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            {["Image to Video","Text to Video","Models & Tools","Pricing","Blog"].map(item => (
              <a key={item} href="#" className="block px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                {item}
              </a>
            ))}
            <button className="mt-3 w-full btn-primary px-4 py-2.5 text-sm">Try Free</button>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200">
      {children}
    </a>
  );
}

