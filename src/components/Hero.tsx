"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ParticleField3D from "./ParticleField3D";
import HologramEffect from "./HologramEffect";
import AnimatedText from "./AnimatedText";
import CyberButton from "./CyberButton";
import MatrixRain from "./MatrixRain";
import MouseGlow from "./MouseGlow";

const MODELS = ["Seedance", "Sora 2", "Veo 3", "Kling V3", "More"];



export default function Hero() {
  const router = useRouter();
  const [activeModel, setActiveModel] = useState("Seedance");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
      style={{ background: "#080810" }}>

      {/* ── Matrix 代码雨背景 ── */}
      <MatrixRain />

      {/* ── 3D 粒子场景 ── */}
      <ParticleField3D />

      {/* ── 全息投影效果 ── */}
      <HologramEffect />

      {/* ── 鼠标光晕 ── */}
      <MouseGlow />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full text-xs font-medium text-purple-300"
          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"/>
          2026 Seedance 2.0 Released
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          <AnimatedText text="Seedance 2.0" gradient glitch />
          <br />
          <AnimatedText text="AI Video Generator" gradient />
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          下一代 AI 视频生成平台 · 文本转视频 · 图片转视频 · <strong className="text-white/90">专业级 1080p 输出</strong>
          <br />
          无需拍摄，无需剪辑软件，一键生成高质量视频内容
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <CyberButton
            onClick={() => router.push('/generator')}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="3"/>
                <path d="M8 5v14l11-7z"/>
              </svg>
            }
          >
            Start Creating Free Videos
          </CyberButton>
        </div>

        {/* All-in-One Models */}
        <div className="glass-card rounded-2xl p-6 max-w-3xl mx-auto">
          <p className="text-sm text-white/40 mb-4 uppercase tracking-wider font-medium">All-in-One AI Video Generator</p>
          <div className="flex flex-wrap justify-center gap-2">
            {MODELS.map(model => (
              <button
                key={model}
                onClick={() => setActiveModel(model)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeModel === model ? "tag-active" : "tag-inactive"
                }`}>
                {model === "More" ? `+More Models` : model}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-4">
            Access Seedance, Sora, Veo, Kling and more — all in one place
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs">Scroll to explore</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  );
}

