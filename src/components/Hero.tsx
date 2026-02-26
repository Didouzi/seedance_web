"use client";
import { useState } from "react";

const MODELS = ["Seedance", "Sora 2", "Veo 3", "Kling V3", "More"];

export default function Hero() {
  const [activeModel, setActiveModel] = useState("Seedance");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center hero-gradient overflow-hidden pt-16">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pulse-glow pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)" }}/>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)" }}/>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full text-xs font-medium text-purple-300"
          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"/>
          2026 Seedance 2.0 Released
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          <span className="gradient-text">Free AI Video</span>
          <br />
          <span className="text-white">Generator</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Turn text and images into professional <strong className="text-white/90">1080p videos</strong> with
          synchronized audio and multi-shot storytelling. No filming. No editing software.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button className="btn-primary px-7 py-3.5 text-base flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="3"/>
              <path d="M8 5v14l11-7z"/>
            </svg>
            Image to Video
          </button>
          <button className="btn-secondary px-7 py-3.5 text-base flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Text to Video
          </button>
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

