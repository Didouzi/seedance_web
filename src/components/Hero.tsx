"use client";
import { useState, useEffect, useRef } from "react";

const MODELS = ["Seedance", "Sora 2", "Veo 3", "Kling V3", "More"];

// 视差滚动状态
function useParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

// 生成星星数据的函数（固定种子确保一致性）
function generateStars() {
  return Array.from({ length: 80 }, (_, i) => {
    // 使用索引作为伪随机种子
    const seed1 = (i * 9301 + 49297) % 233280;
    const seed2 = (i * 1234 + 5678) % 233280;
    const seed3 = (i * 4321 + 8765) % 233280;
    const rnd1 = seed1 / 233280;
    const rnd2 = seed2 / 233280;
    const rnd3 = seed3 / 233280;

    return {
      id: i,
      top: `${rnd1 * 100}%`,
      left: `${rnd2 * 100}%`,
      delay: `${rnd3 * 6}s`,
      duration: `${2 + rnd1 * 4}s`,
      opacity: 0.1 + rnd2 * 0.5,
      size: rnd3 > 0.85 ? 3 : rnd3 > 0.6 ? 2 : 1,
    };
  });
}

function generateMeteors() {
  return Array.from({ length: 5 }, (_, i) => {
    const seed1 = (i * 7919 + 12345) % 233280;
    const seed2 = (i * 3141 + 27183) % 233280;
    const rnd1 = seed1 / 233280;
    const rnd2 = seed2 / 233280;

    return {
      id: i,
      top: `${5 + rnd1 * 40}%`,
      left: `${rnd2 * 60}%`,
      width: `${60 + rnd1 * 120}px`,
      delay: `${i * 4 + rnd2 * 3}s`,
      duration: `${2.5 + rnd1 * 2}s`,
    };
  });
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Floating orbs
    const orbs = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 60 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      hue: Math.random() > 0.5 ? 265 : 220, // purple or blue
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const o of orbs) {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = canvas.width + o.r;
        if (o.x > canvas.width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = canvas.height + o.r;
        if (o.y > canvas.height + o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},80%,55%,0.07)`);
        g.addColorStop(1, `hsla(${o.hue},80%,55%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export default function Hero() {
  const [activeModel, setActiveModel] = useState("Seedance");
  const scrollY = useParallax();
  const [mounted, setMounted] = useState(false);
  const [stars] = useState(() => generateStars());
  const [meteors] = useState(() => generateMeteors());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
      style={{ background: "#080810" }}>

      {/* ── Animated Canvas Orbs ── */}
      <div style={{ transform: mounted ? `translateY(${scrollY * 0.3}px)` : 'translateY(0)' }}>
        <ParticleCanvas />
      </div>

      {/* ── Scrolling grid ── */}
      <div
        className="absolute inset-0 bg-grid opacity-100 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          transform: mounted ? `translateY(${scrollY * 0.5}px)` : 'translateY(0)'
        }}/>

      {/* ── Aurora blob 1 (purple, top-center) ── */}
      <div
        className="absolute top-[-10%] left-[20%] w-[700px] h-[700px] rounded-full pointer-events-none aurora-spin"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 65%)",
          filter: "blur(40px)",
          transform: mounted ? `translateY(${scrollY * 0.2}px)` : 'translateY(0)'
        }}/>

      {/* ── Aurora blob 2 (blue, bottom-right) ── */}
      <div
        className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none float-animation2"
        style={{
          background: "radial-gradient(ellipse, rgba(59,130,246,0.14) 0%, transparent 65%)",
          filter: "blur(50px)",
          transform: mounted ? `translateY(${scrollY * 0.4}px)` : 'translateY(0)'
        }}/>

      {/* ── Aurora blob 3 (cyan, left) ── */}
      <div
        className="absolute top-[30%] left-[-8%] w-[400px] h-[400px] rounded-full pointer-events-none float-animation3"
        style={{
          background: "radial-gradient(ellipse, rgba(6,182,212,0.10) 0%, transparent 65%)",
          filter: "blur(40px)",
          transform: mounted ? `translateY(${scrollY * 0.15}px)` : 'translateY(0)'
        }}/>

      {/* ── Stars ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ transform: mounted ? `translateY(${scrollY * 0.1}px)` : 'translateY(0)' }}>
        {stars.map(s => (
          <div key={s.id} className="star absolute"
            style={{
              top: s.top, left: s.left, width: s.size, height: s.size,
              opacity: s.opacity,
              animation: `twinkle ${s.duration} ${s.delay} ease-in-out infinite`,
            }}/>
        ))}
      </div>

      {/* ── Meteors ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {meteors.map(m => (
          <div key={m.id} className="meteor absolute"
            style={{
              top: m.top, left: m.left, width: m.width,
              animationDuration: m.duration,
              animationDelay: m.delay,
              opacity: 0,
            }}/>
        ))}
      </div>

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

