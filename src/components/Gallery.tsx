"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const TAGS = ["All", "Text to Video", "Image to Video", "Native Audio", "Multi-Shot", "Video Editing", "Video Extension"];

const GALLERY_ITEMS = [
  { id: 1, tag: "Text to Video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", title: "Cosmic Portal Scene" },
  { id: 2, tag: "Image to Video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", title: "Street Chase Animation" },
  { id: 3, tag: "Native Audio", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", title: "Dynamic Scene with Audio" },
  { id: 4, tag: "Multi-Shot", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", title: "Multi-Shot Sequence" },
  { id: 5, tag: "Video Editing", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", title: "Edited Scene" },
  { id: 6, tag: "Text to Video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", title: "Cinematic Landscape" },
  { id: 7, tag: "Video Extension", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", title: "Extended Scene" },
  { id: 8, tag: "Multi-Shot", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", title: "Epic Multi-Shot" },
  { id: 9, tag: "Text to Video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", title: "Action Scene" },
  { id: 10, tag: "Image to Video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", title: "Sci-Fi Animation" },
  { id: 11, tag: "Native Audio", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4", title: "Audio Enhanced" },
  { id: 12, tag: "Video Editing", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", title: "Professional Edit" },
];

function VideoCard({ item, index }: { item: typeof GALLERY_ITEMS[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 交错淡入动画
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionDelay: `${index * 50}ms`,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
      <div className="relative aspect-video bg-black/20">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline>
          <source src={item.src} type="video/mp4"/>
        </video>

        {/* 悬停遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tag */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(59, 130, 246, 0.9)",
              color: "white",
              backdropFilter: "blur(12px)",
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
            }}>
            {item.tag}
          </span>
        </div>

        {/* 播放图标 - 悬停显示 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="p-5 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <p className="text-base text-white font-semibold drop-shadow-md">{item.title}</p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const t = useTranslations('gallery');
  const [activeTag, setActiveTag] = useState("All");
  const [displayCount, setDisplayCount] = useState(9);
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
    setDisplayCount(9);
  };

  return (
    <section className="py-24 px-4 section-divider bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            {t('title')}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium">
            {t('description')}
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                activeTag === tag
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 backdrop-blur-sm"
              }`}>
              {tag}
            </button>
          ))}
        </div>

        {/* Grid - 3列布局,更充实 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
              className="px-10 py-4 rounded-full text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {t('loading')}
                </span>
              ) : (
                t('loadMore')
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

