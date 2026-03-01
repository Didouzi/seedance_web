"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-all duration-300 rounded-lg px-2"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
      }}>
      <button
        className="w-full flex items-center justify-between py-6 text-left group"
        onClick={() => setOpen(!open)}>
        <span className={`font-semibold pr-4 transition-all duration-300 ${
          open ? 'text-blue-400' : 'text-white group-hover:text-blue-300'
        }`}>
          {q}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
          open
            ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30 rotate-180 scale-110 shadow-lg shadow-blue-500/20"
            : "bg-white/10 group-hover:bg-white/20 group-hover:scale-110"
        }`}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform duration-500 ${open ? 'rotate-180' : ''} text-gray-300`}>
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
        }`}>
        <div className={`transform transition-all duration-500 ${
          open ? 'translate-y-0' : '-translate-y-4'
        }`}>
          <p className="text-gray-300 leading-relaxed text-[15px] font-medium">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const t = useTranslations('faq');
  const faqs = t.raw('items') as Array<{ q: string; a: string }>;

  return (
    <section className="py-24 px-4 section-divider bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm text-blue-400 uppercase tracking-wider font-semibold mb-3">{t('badge')}</p>
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            {t('title')}
          </h2>
        </div>

        {/* Accordion */}
        <div className="rounded-2xl px-6 py-2 transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i}/>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center rounded-3xl p-10 relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.2) 0%, transparent 60%)" }}/>
          <h3 className="text-3xl font-bold text-white mb-4 relative z-10 tracking-tight drop-shadow-lg">Start Creating with Seedance 2.0</h3>
          <p className="text-gray-300 mb-8 relative z-10 max-w-md mx-auto font-medium">
            Professional video from a text prompt. Free to start, no credit card needed.
            Join thousands of creators already using Seedance 2.0.
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <button className="px-10 py-4 rounded-full text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all shadow-lg shadow-blue-500/30">Start Creating Free</button>
            <button className="px-10 py-4 rounded-full text-base font-semibold bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:scale-105 backdrop-blur-sm transition-all">Browse Examples</button>
          </div>
        </div>
      </div>
    </section>
  );
}

