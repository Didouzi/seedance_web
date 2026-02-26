"use client";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PERSONAS = [
  {
    id: "animators",
    label: "Animators & Artists",
    icon: "🎨",
    title: "Animate Your Art",
    desc: "Animate characters, create manga series, and produce cartoon episodes with Seedance 2.0.",
    features: [
      { title: "Character Animation", desc: "Bring illustrated characters to life. Upload your artwork and Seedance 2.0 handles motion, expressions, and lip sync." },
      { title: "Manga & Comic Videos", desc: "Turn static manga panels into animated episodes with Seedance 2.0. Consistent characters across every scene." },
      { title: "Cartoon Series", desc: "Produce multi-episode animated series. Same characters, same style, different stories." },
      { title: "Motion Graphics", desc: "Animated logos, title sequences, and visual effects. No After Effects required." },
    ],
  },
  {
    id: "filmmakers",
    label: "Filmmakers",
    icon: "🎬",
    title: "Cinematic AI Video",
    desc: "Create cinematic sequences, test shots, and produce scenes without a crew or equipment.",
    features: [
      { title: "Scene Previz", desc: "Visualize scenes before shooting. Test camera angles, lighting, and compositions in seconds." },
      { title: "B-Roll Generation", desc: "Generate supplemental footage from text descriptions. Perfect for documentaries and explainers." },
      { title: "Multi-Shot Sequences", desc: "Consistent characters and style across scenes. Tell longer stories without drift." },
      { title: "Post-Production", desc: "AI video editing to swap elements, change styles, or extend existing footage." },
    ],
  },
  {
    id: "creators",
    label: "Content Creators",
    icon: "📱",
    title: "Content at Scale",
    desc: "Produce YouTube videos, TikTok content, and social media clips faster than ever before.",
    features: [
      { title: "Social Clips", desc: "Vertical, square, or horizontal — every format for every platform. One tool, all outputs." },
      { title: "Beat Sync Videos", desc: "Feed images and a rhythm track. AI cuts and transitions on beat, automatically." },
      { title: "Thumbnails & Hooks", desc: "Generate eye-catching opening sequences and thumbnails with a single prompt." },
      { title: "Series Production", desc: "Maintain consistent branding across hundreds of clips without manual effort." },
    ],
  },
  {
    id: "marketers",
    label: "Marketers & Teams",
    icon: "📈",
    title: "Marketing at Speed",
    desc: "Create product demos, ads, and explainer videos without a video production budget.",
    features: [
      { title: "Product Demos", desc: "Show your product in action with AI-generated demonstration videos." },
      { title: "Ad Creatives", desc: "Generate multiple ad variations from a single brief. Test what converts." },
      { title: "Explainer Videos", desc: "Turn complex concepts into clear animated explanations in minutes." },
      { title: "Brand Content", desc: "Consistent visual style across all video content. No filmmaker required." },
    ],
  },
];

export default function WhoItsFor() {
  const [active, setActive] = useState(0);
  const persona = PERSONAS[active];
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 px-4 section-divider transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ background: "#0a0a0f" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm text-purple-400 uppercase tracking-wider font-medium mb-3">WHO IT&apos;S FOR</p>
          <h2 className="text-4xl font-bold text-white mb-4">Made for Every Creator</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Animation, film, manga series, YouTube content, product demos. Seedance 2.0 is your AI video generator.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {PERSONAS.map((p, i) => (
            <button key={p.id} onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                active === i ? "tag-active" : "tag-inactive"
              }`}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-card rounded-3xl p-8 lg:p-12">
          <div className="mb-8">
            <div className="text-5xl mb-4">{persona.icon}</div>
            <h3 className="text-3xl font-bold text-white mb-3">{persona.title}</h3>
            <p className="text-white/60 text-lg">{persona.desc}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {persona.features.map(feat => (
              <div key={feat.title} className="rounded-xl p-5 hover:border-white/15 transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"/>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{feat.title}</h4>
                    <p className="text-sm text-white/50 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

