"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "What makes Seedance 2.0 different from other AI video generators?",
    a: "Native audio. Tools like Runway and Sora generate silent video. Seedance 2.0 creates synchronized dialogue, sound effects, and music in one step. It also supports multi-shot storytelling with character consistency across scenes.",
  },
  {
    q: "How long does Seedance 2.0 take to generate a video?",
    a: "Most videos are ready in 30 to 60 seconds. Video, audio, and transitions are processed simultaneously, so there is no separate audio syncing step.",
  },
  {
    q: "What resolution does Seedance 2.0 output?",
    a: "1080p. Sharp enough for YouTube, TikTok, Instagram, and professional presentations.",
  },
  {
    q: "Can I use images as input for Seedance 2.0?",
    a: "Yes. Seedance 2.0 supports both text-to-video and image-to-video. You can upload up to 12 references per project — images, video clips, and audio to guide the output.",
  },
  {
    q: "Is Seedance 2.0 free to use?",
    a: "Yes. Start for free, no credit card required. The free tier includes standard quality output. Upgrade for 1080p resolution, longer videos, and priority generation.",
  },
  {
    q: "Do characters stay consistent in Seedance 2.0 videos?",
    a: "Yes. Same face, clothing, and style across every frame and scene. No character drift, even in multi-shot sequences.",
  },
  {
    q: "What output formats does Seedance 2.0 support?",
    a: "MP4 and WebM. Compatible with all major platforms and editing software.",
  },
  {
    q: "Who owns the videos I create with Seedance 2.0?",
    a: "You do. Full commercial rights, no attribution required.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setOpen(!open)}>
        <span className="text-white font-medium pr-4 group-hover:text-purple-300 transition-colors">
          {q}
        </span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
          open ? "bg-purple-500/20 rotate-45" : "bg-white/5"
        }`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-5" : "max-h-0"}`}>
        <p className="text-white/55 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="py-24 px-4 section-divider" style={{ background: "#0d0d1a" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-purple-400 uppercase tracking-wider font-medium mb-3">FAQ</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Common Questions About Seedance 2.0
          </h2>
        </div>

        {/* Accordion */}
        <div className="glass-card rounded-2xl px-6 py-2">
          {FAQS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a}/>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center glass-card rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%)" }}/>
          <h3 className="text-3xl font-bold text-white mb-4 relative z-10">Start Creating with Seedance 2.0</h3>
          <p className="text-white/50 mb-8 relative z-10 max-w-md mx-auto">
            Professional video from a text prompt. Free to start, no credit card needed.
            Join thousands of creators already using Seedance 2.0.
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <button className="btn-primary px-8 py-3.5 text-base">Start Creating Free</button>
            <button className="btn-secondary px-8 py-3.5 text-base">Browse Examples</button>
          </div>
        </div>
      </div>
    </section>
  );
}

