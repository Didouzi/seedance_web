"use client";
import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const STEPS_CONFIG = [
  {
    id: "describe",
    num: "01",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#7c3aed",
  },
  {
    id: "generate",
    num: "02",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 3l14 9-14 9V3z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#3b82f6",
  },
  {
    id: "download",
    num: "03",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#10b981",
  },
];

export default function HowItWorks() {
  const t = useTranslations('howItWorks');
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 px-4 transition-all duration-1000 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm text-blue-400 uppercase tracking-wider font-semibold mb-3">{t('badge')}</p>
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            {t('title')}
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto font-medium">
            {t('description')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {STEPS_CONFIG.map((step) => (
            <div key={step.num} className="rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}20, ${step.color}40)`,
                    border: `2px solid ${step.color}`,
                    boxShadow: `0 4px 16px ${step.color}40`
                  }}>
                  <div style={{ color: step.color }}>
                    {step.icon}
                  </div>
                </div>
                <span className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                  {step.num}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">{t(`steps.${step.id}.title`)}</h3>
              <p className="text-gray-300 leading-relaxed font-medium">
                {t(`steps.${step.id}.desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4">
          {['resolution', 'time', 'ownership'].map(statKey => (
            <div key={statKey} className="rounded-2xl p-6 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 drop-shadow-lg">
                {t(`stats.${statKey}.value`)}
              </div>
              <div className="text-sm text-gray-300 font-medium">{t(`stats.${statKey}.label`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

