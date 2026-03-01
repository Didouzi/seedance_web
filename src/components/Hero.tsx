"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const MODELS = ["Seedance", "Sora 2", "Veo 3", "Kling V3", "More"];

// AI 视频背景列表 - 使用 Gallery 中的视频
const AI_VIDEOS = [
  "https://cdn.seedance2.so/videos/seedance2-hero/20260208-1330/jimeng-2026-02-05-1958.mp4",
  "https://cdn.seedance2.so/videos/seedance2-hero/20260208-1322/jimeng-2026-02-05-6539.mp4",
  "https://cdn.seedance2.so/videos/inspirations/img2vid/20260209-2336/video11.mp4",
  "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-15.mp4",
  "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-16.mp4",
  "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-17.mp4",
  "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-18.mp4",
  "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-19.mp4",
  "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-20.mp4",
  "https://cdn.seedance2.so/videos/inspirations/img2vid/20260209-2336/video12.mp4",
  "https://cdn.seedance2.so/videos/inspirations/img2vid/20260209-2336/video13.mp4",
  "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-21.mp4",
];

export default function Hero() {
  const t = useTranslations('hero');
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'zh';
  const [activeModel, setActiveModel] = useState("Seedance");
  const [mounted, setMounted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 客户端挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 视频播放结束时切换到下一个
  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % AI_VIDEOS.length);
    setVideoLoaded(false);
  };

  // 视频加载成功
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    console.log('✅ 视频加载成功:', AI_VIDEOS[currentVideoIndex]);
  };

  // 视频加载失败
  const handleVideoError = () => {
    console.error('❌ 视频加载失败:', AI_VIDEOS[currentVideoIndex]);
    setVideoLoaded(false);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* ── 背景层 ── */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {/* 渐变背景 - 始终显示 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900" />

        {/* 动态光晕 - 只在客户端渲染 */}
        {mounted && (
          <>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: '1s' }} />
          </>
        )}

        {/* 视频背景 */}
        {mounted && (
          <video
            ref={videoRef}
            key={currentVideoIndex}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            preload="metadata"
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
            onEnded={handleVideoEnded}
            style={{
              opacity: videoLoaded ? 0.5 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          >
            <source src={AI_VIDEOS[currentVideoIndex]} type="video/mp4" />
          </video>
        )}

        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full text-sm font-semibold text-purple-200"
          style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)" }}>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"/>
          {t('badge')}
        </div>

        {/* Headline */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8 tracking-tight">
          <span className="gradient-text">{t('title')}</span>
          <br />
          <span className="gradient-text">{t('subtitle')}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl lg:text-3xl text-white/70 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
          {t('description')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => router.push(`/${locale}/generator`)}
            className="btn-primary px-8 py-4 text-lg flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="3"/>
              <path d="M8 5v14l11-7z"/>
            </svg>
            {t('cta')}
          </button>
        </div>

        {/* All-in-One Models */}
        <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
          <p className="text-base text-white/50 mb-6 uppercase tracking-wider font-semibold">All-in-One AI Video Generator</p>
          <div className="flex flex-wrap justify-center gap-3">
            {MODELS.map(model => (
              <button
                key={model}
                onClick={() => setActiveModel(model)}
                className={`px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                  activeModel === model ? "tag-active" : "tag-inactive"
                }`}>
                {model === "More" ? `+More Models` : model}
              </button>
            ))}
          </div>
          <p className="text-sm text-white/40 mt-6 font-medium">
            Access Seedance, Sora, Veo, Kling and more — all in one place
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="text-sm font-medium">Scroll to explore</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  );
}

