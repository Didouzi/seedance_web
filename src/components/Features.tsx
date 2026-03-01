"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

const FEATURES_CONFIG = [
  {
    id: "textToVideo",
    icon: "✍️",
    videoSrc: "https://cdn.seedance2.so/videos/seedance2-hero/20260208-1330/jimeng-2026-02-05-1958.mp4",
    color: "#7c3aed",
  },
  {
    id: "imageToVideo",
    icon: "🖼️",
    videoSrc: "https://cdn.seedance2.so/videos/seedance2-hero/20260208-1322/jimeng-2026-02-05-6539.mp4",
    color: "#3b82f6",
  },
  {
    id: "reference",
    icon: "🎯",
    videoSrc: "",
    color: "#06b6d4",
  },
  {
    id: "extension",
    icon: "⏩",
    videoSrc: "",
    color: "#f59e0b",
  },
  {
    id: "editing",
    icon: "✂️",
    videoSrc: "",
    color: "#ec4899",
  },
];

export default function Features() {
  const t = useTranslations('features');
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const config = FEATURES_CONFIG[active];
  const feat = {
    ...config,
    label: t(`${config.id}.label`),
    title: t(`${config.id}.title`),
    desc: t(`${config.id}.desc`),
    cta: t(`${config.id}.cta`),
    prompt: t(`${config.id}.prompt`),
  };

  // 更新滑动指示器位置
  useEffect(() => {
    if (tabsRef.current) {
      const activeBtn = tabsRef.current.children[active] as HTMLElement;
      if (activeBtn) {
        setIndicatorStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
        });
      }
    }
  }, [active]);

  const handleTabChange = (index: number) => {
    if (index === active) return;
    setIsTransitioning(true);
    setActive(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Tab Navigation */}
        <div className="relative flex flex-wrap justify-center gap-3 mb-16" ref={tabsRef}>
          {/* 滑动指示器 */}
          <div
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out rounded-full"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              transform: 'translateY(100%)',
            }}
          />
          {FEATURES_CONFIG.map((f, i) => (
            <button
              key={f.id}
              onClick={() => handleTabChange(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                active === i
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                  : "bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:scale-105 backdrop-blur-sm"
              }`}>
              {t(`${f.id}.label`)}
            </button>
          ))}
        </div>

        {/* Feature Card */}
        <div className="rounded-3xl overflow-hidden group perspective-1000"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: Info */}
            <div
              className={`p-8 lg:p-12 flex flex-col justify-center transition-all duration-500 ${
                isTransitioning ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'
              }`}
              key={`info-${active}`}>
              <div className="text-4xl mb-4 animate-bounce-in">{feat.icon}</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">{feat.title}</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed font-medium">{feat.desc}</p>

              {/* Prompt preview */}
              <div className="rounded-xl p-4 mb-8 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                <p className="text-xs text-blue-300 uppercase tracking-wider mb-2 font-semibold">{t('promptLabel')}</p>
                <p className="text-sm text-gray-200 line-clamp-3 font-medium leading-relaxed">{feat.prompt}</p>
              </div>

              <button className="px-8 py-4 rounded-full text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all shadow-lg shadow-blue-500/30 self-start">
                {feat.cta} →
              </button>
            </div>

            {/* Right: Video/Visual */}
            <div
              className={`relative min-h-[300px] lg:min-h-[500px] rounded-r-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              key={`video-${active}`}
              style={{
                transformStyle: 'preserve-3d',
              }}>
              {feat.videoSrc ? (
                <video
                  key={feat.videoSrc}
                  className="w-full h-full object-cover"
                  autoPlay muted loop playsInline>
                  <source src={feat.videoSrc} type="video/mp4"/>
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{feat.icon}</div>
                    <p className="text-gray-400 text-sm font-medium">Video preview</p>
                  </div>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

