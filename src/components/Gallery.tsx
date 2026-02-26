"use client";
import { useState } from "react";

const TAGS = ["Text to Video", "Image to Video", "Native Audio", "Multi-Shot", "Video Editing", "Video Extension"];

const GALLERY_ITEMS = [
  { id: 1, tag: "Text to Video", src: "https://cdn.seedance2.so/videos/seedance2-hero/20260208-1330/jimeng-2026-02-05-1958.mp4", title: "Cosmic Portal Scene" },
  { id: 2, tag: "Image to Video", src: "https://cdn.seedance2.so/videos/seedance2-hero/20260208-1322/jimeng-2026-02-05-6539.mp4", title: "Street Chase Animation" },
  { id: 3, tag: "Native Audio", src: "https://cdn.seedance2.so/videos/inspirations/img2vid/20260209-2336/video11.mp4", title: "Dynamic Scene with Audio" },
  { id: 4, tag: "Multi-Shot", src: "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-15.mp4", title: "Multi-Shot Sequence" },
  { id: 5, tag: "Video Editing", src: "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1056/prompt-44.mp4", title: "Edited Scene" },
  { id: 6, tag: "Text to Video", src: "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-15.mp4", title: "Cinematic Landscape" },
];

function VideoCard({ item }: { item: typeof GALLERY_ITEMS[0] }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:border-white/20 transition-all duration-300">
      <div className="relative aspect-video bg-black/50">
        <video
          className="w-full h-full object-cover"
          muted loop playsInline
          ref={(el) => {
            if (el) {
              if (playing) el.play();
              else el.pause();
            }
          }}
          onMouseEnter={() => setPlaying(true)}
          onMouseLeave={() => setPlaying(false)}>
          <source src={item.src} type="video/mp4"/>
        </video>

        {/* Play overlay */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: "rgba(124,58,237,0.8)", color: "white", backdropFilter: "blur(10px)" }}>
            {item.tag}
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm text-white/70 font-medium">{item.title}</p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [activeTag, setActiveTag] = useState("Text to Video");

  const filtered = activeTag === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.tag === activeTag);

  return (
    <section className="py-24 px-4 section-divider" style={{ background: "#0d0d1a" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Seedance 2.0 AI Video Generator Gallery
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Real videos made with Seedance 2.0 — text to video, image to video, video editing, and more.
            Hover any clip to see the results.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTag === tag ? "tag-active" : "tag-inactive"
              }`}>
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(filtered.length > 0 ? filtered : GALLERY_ITEMS.slice(0, 3)).map(item => (
            <VideoCard key={item.id} item={item}/>
          ))}
        </div>
      </div>
    </section>
  );
}

