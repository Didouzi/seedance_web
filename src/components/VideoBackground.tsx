"use client";
import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  videoUrl?: string;
  opacity?: number;
  blur?: number;
}

export default function VideoBackground({ 
  videoUrl = "https://cdn.pixabay.com/video/2023/11/15/189011-885825515_large.mp4",
  opacity = 0.3,
  blur = 2
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    
    // Ensure video plays on mobile
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log('Video autoplay failed:', error);
      }
    };
    
    playVideo();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          opacity: isLoaded ? opacity : 0,
          filter: `blur(${blur}px)`,
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      {/* Gradient Overlay - darker at edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080810]/70 via-[#080810]/30 to-[#080810]/90" />
      
      {/* Vignette Effect - creates focus on center */}
      <div 
        className="absolute inset-0" 
        style={{
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(8,8,16,0.8) 100%)"
        }}
      />

      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

