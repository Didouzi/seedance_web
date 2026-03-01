"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const STEPS = [
  {
    num: "01",
    title: "Describe Your Scene",
    desc: "Write what you want to see. A product demo with voiceover, or a cinematic landscape with ambient music. Add reference images for better results.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#7c3aed",
  },
  {
    num: "02",
    title: "Generate Your Video",
    desc: "Seedance 2.0 processes your input and creates video, audio, and transitions simultaneously. Most clips are ready in under 60 seconds.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 3l14 9-14 9V3z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#3b82f6",
  },
  {
    num: "03",
    title: "Download and Use",
    desc: "Your video is ready in 1080p. Download, share to social platforms, or edit further. Not happy? Regenerate with adjusted prompts.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#10b981",
  },
];

export default function HowItWorks() {
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
          <p className="text-sm text-blue-400 uppercase tracking-wider font-semibold mb-3">How It Works</p>
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            From Idea to Video with Seedance 2.0
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto font-medium">
            Describe your video, let Seedance 2.0 do the work, download your result. No editing skills needed.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(100%-16px)] w-full h-px z-0"
                  style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.3), rgba(147,51,234,0.1))" }}/>
              )}

              <div className="rounded-2xl p-8 relative z-10 transition-all duration-300 group hover:shadow-lg hover:bg-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
                {/* Step number */}
                <div className="text-6xl font-black mb-4"
                  style={{ color: `${step.color}15`, WebkitTextStroke: `1px ${step.color}50` }}>
                  {step.num}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ background: `${step.color}30`, color: step.color }}>
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4">
          {[
            { value: "1080p", label: "Output Resolution" },
            { value: "< 60s", label: "Generation Time" },
            { value: "100%", label: "You Own It" },
          ].map(stat => (
            <div key={stat.value} className="rounded-2xl p-6 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 drop-shadow-lg">{stat.value}</div>
              <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

