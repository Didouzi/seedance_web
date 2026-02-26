"use client";
import { useState, useEffect } from "react";

const TAGS = ["All", "Text to Video", "Image to Video", "Native Audio", "Multi-Shot", "Video Editing", "Video Extension"];

const GALLERY_ITEMS = [
  { id: 1, tag: "Text to Video", src: "https://cdn.seedance2.so/videos/seedance2-hero/20260208-1330/jimeng-2026-02-05-1958.mp4", title: "Cosmic Portal Scene" },
  { id: 2, tag: "Image to Video", src: "https://cdn.seedance2.so/videos/seedance2-hero/20260208-1322/jimeng-2026-02-05-6539.mp4", title: "Street Chase Animation" },
  { id: 3, tag: "Native Audio", src: "https://cdn.seedance2.so/videos/inspirations/img2vid/20260209-2336/video11.mp4", title: "Dynamic Scene with Audio" },
  { id: 4, tag: "Multi-Shot", src: "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-15.mp4", title: "Multi-Shot Sequence" },
  { id: 5, tag: "Video Editing", src: "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1056/prompt-44.mp4", title: "Edited Scene" },
  { id: 6, tag: "Text to Video", src: "https://cdn.seedance2.so/videos/inspirations/awesome-prompts/20260215-1055/prompt-15.mp4", title: "Cinematic Landscape" },
];

function VideoCard({ item, index }: { item: typeof GALLERY_ITEMS[0]; index: number }) {
  const [playing, setPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 交错淡入动画
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`glass-card rounded-2xl overflow-hidden group cursor-pointer hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}>
      <div className="relative aspect-video bg-black/50">
        <video
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all duration-500">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-125 group-hover:bg-white/30 transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Tag */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: "rgba(124,58,237,0.9)", color: "white", backdropFilter: "blur(10px)" }}>
            {item.tag}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-white/70 font-medium group-hover:text-white transition-colors">{item.title}</p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [activeTag, setActiveTag] = useState("All");
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = activeTag === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.tag === activeTag);

  const displayed = filtered.slice(0, displayCount);
  const hasMore = displayed.length < filtered.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 3);
      setIsLoading(false);
    }, 600);
  };

  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    setDisplayCount(6);
  };

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
              onClick={() => handleTagChange(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                activeTag === tag ? "tag-active" : "tag-inactive"
              }`}>
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayed.map((item, index) => (
            <VideoCard key={`${item.id}-${activeTag}`} item={item} index={index}/>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="btn-secondary px-8 py-3 text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Load More Videos'
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

