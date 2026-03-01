"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PERSONAS_CONFIG = [
  { id: "animators", icon: "🎨" },
  { id: "filmmakers", icon: "🎬" },
  { id: "creators", icon: "📱" },
  { id: "marketers", icon: "📈" },
];

export default function WhoItsFor() {
  const t = useTranslations('whoItsFor');
  const [active, setActive] = useState(0);
  const { ref, isVisible } = useScrollAnimation(0.2);

  const config = PERSONAS_CONFIG[active];
  const persona = {
    ...config,
    label: t(`${config.id}.label`),
    title: t(`${config.id}.title`),
    desc: t(`${config.id}.desc`),
  };

  const features = [
    'characterAnimation',
    'mangaVideos',
    'cartoonSeries',
    'motionGraphics'
  ];

  if (config.id === 'filmmakers') {
    features.splice(0, 4, 'scenePreviz', 'bRoll', 'multiShot', 'postProduction');
  } else if (config.id === 'creators') {
    features.splice(0, 4, 'socialClips', 'beatSync', 'thumbnails', 'seriesProduction');
  } else if (config.id === 'marketers') {
    features.splice(0, 4, 'productDemos', 'adCreatives', 'explainerVideos', 'brandContent');
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 px-4 section-divider transition-all duration-1000 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm text-blue-400 uppercase tracking-wider font-semibold mb-3">{t('badge')}</p>
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">{t('title')}</h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto font-medium">
            {t('description')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {PERSONAS_CONFIG.map((p, i) => (
            <button key={p.id} onClick={() => setActive(i)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                active === i
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                  : "bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:scale-105 backdrop-blur-sm"
              }`}>
              {p.icon} {t(`${p.id}.label`)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-3xl p-8 lg:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
          <div className="mb-8">
            <div className="text-5xl mb-4">{persona.icon}</div>
            <h3 className="text-3xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">{persona.title}</h3>
            <p className="text-gray-300 text-lg font-medium">{persona.desc}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((featureKey) => (
              <div key={featureKey} className="rounded-xl p-5 transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}>
                <h4 className="font-bold text-white mb-2 text-lg">{t(`${config.id}.features.${featureKey}.title`)}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{t(`${config.id}.features.${featureKey}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

