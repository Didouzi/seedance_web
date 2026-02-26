"use client";
import { useState, useRef, useEffect } from "react";

const FEATURES = [
  {
    id: "text-to-video",
    label: "Text to Video",
    title: "Text to Video AI",
    desc: "Type a scene, get a video. Turn your words into 1080p footage with synchronized audio. No filming required.",
    cta: "Try Seedance 2.0",
    icon: "✍️",
    prompt: "A father and his young son stand together on a circular stone platform before a massive ancient portal gateway. The portal glows with swirling bright blue cosmic energy. Cinematic wide shot, dramatic blue lighting, sci-fi fantasy atmosphere.",
    videoSrc: "https://cdn.seedance2.so/videos/seedance2-hero/20260208-1330/jimeng-2026-02-05-1958.mp4",
    color: "#7c3aed",
  },
  {
    id: "image-to-video",
    label: "Image to Video",
    title: "Image to Video AI",
    desc: "Drop in a photo, Seedance 2.0 does the rest. Animate any still image with natural motion and synchronized sound.",
    cta: "Try Image to Video",
    icon: "🖼️",
    prompt: "The camera follows a man in black sprinting through the streets. A crowd chases behind him. Chaotic shouts echo from the crowd.",
    videoSrc: "https://cdn.seedance2.so/videos/seedance2-hero/20260208-1322/jimeng-2026-02-05-6539.mp4",
    color: "#3b82f6",
  },
  {
    id: "reference",
    label: "Reference to Video",
    title: "Reference to Video AI",
    desc: "Give Seedance 2.0 your reference images or clips and it builds new video around them. AI video generation with style and motion you actually control.",
    cta: "Try Reference to Video",
    icon: "🎯",
    prompt: "Use the female star from @Image1 as the main subject, reference the camera movements from @Video1. The star's dance moves also reference the woman's dance, performing energetically on stage.",
    videoSrc: "",
    color: "#06b6d4",
  },
  {
    id: "extension",
    label: "Video Extension",
    title: "AI Video Extension",
    desc: "Need a longer clip? Seedance 2.0 picks up where your footage ends and keeps the look consistent.",
    cta: "Try Video Extension",
    icon: "⏩",
    prompt: "Extend 15 seconds. A donkey rides a motorcycle through a surreal advertisement world, referencing the character design from the provided images.",
    videoSrc: "",
    color: "#f59e0b",
  },
  {
    id: "editing",
    label: "Video Editing",
    title: "AI Video Editing",
    desc: "Swap characters, rewrite the plot, add objects mid-scene. Change existing footage without starting over.",
    cta: "Try Video Editing",
    icon: "✂️",
    prompt: "Rewrite the entire plot: A suited man sits at a bar, calm expression, gently swirling his glass. He suddenly pulls out an oversized snack gift pack from under the table.",
    videoSrc: "",
    color: "#ec4899",
  },
  {
    id: "beat-sync",
    label: "Beat Sync",
    title: "Beat Sync Video",
    desc: "Feed Seedance 2.0 your images and a rhythm track. The AI cuts and transitions on beat, automatically.",
    cta: "Try Beat Sync",
    icon: "🎵",
    prompt: "The girl from the poster keeps changing outfits, with clothing styles referencing @Image1 and @Image2. Video rhythm follows @Video.",
    videoSrc: "",
    color: "#10b981",
  },
];

export default function Features() {
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const feat = FEATURES[active];

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
    <section className="py-24 px-4" style={{ background: "#0a0a0f" }}>
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="relative flex flex-wrap justify-center gap-2 mb-16" ref={tabsRef}>
          {/* 滑动指示器 */}
          <div
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out rounded-full"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              transform: 'translateY(100%)',
            }}
          />
          {FEATURES.map((f, i) => (
            <button
              key={f.id}
              onClick={() => handleTabChange(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === i ? "tag-active scale-105" : "tag-inactive hover:scale-105"
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Feature Card */}
        <div className="glass-card rounded-3xl overflow-hidden group perspective-1000">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: Info */}
            <div
              className={`p-8 lg:p-12 flex flex-col justify-center transition-all duration-500 ${
                isTransitioning ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'
              }`}
              key={`info-${active}`}>
              <div className="text-4xl mb-4 animate-bounce-in">{feat.icon}</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{feat.title}</h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">{feat.desc}</p>

              {/* Prompt preview */}
              <div className="glass-card rounded-xl p-4 mb-8 hover:bg-white/5 transition-all duration-300">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Prompt</p>
                <p className="text-sm text-white/70 line-clamp-3">{feat.prompt}</p>
              </div>

              <button className="btn-primary px-6 py-3 text-sm self-start hover:scale-105 transition-transform">
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
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: `radial-gradient(ellipse at center, ${feat.color}22 0%, transparent 70%), #0d0d1a` }}>
                  <div className="text-center">
                    <div className="text-8xl mb-4">{feat.icon}</div>
                    <p className="text-white/40 text-sm">Video preview</p>
                  </div>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

