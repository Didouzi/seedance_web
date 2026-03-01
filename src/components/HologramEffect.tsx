"use client";
import { useEffect, useState } from "react";

// 生成固定的光点位置（避免 Hydration 错误）
function generateFlickerDots() {
  return Array.from({ length: 20 }, (_, i) => {
    const seed1 = (i * 12345 + 67890) % 233280;
    const seed2 = (i * 54321 + 98760) % 233280;
    const seed3 = (i * 11111 + 22222) % 233280;
    const rnd1 = seed1 / 233280;
    const rnd2 = seed2 / 233280;
    const rnd3 = seed3 / 233280;

    return {
      id: i,
      left: `${rnd1 * 100}%`,
      top: `${rnd2 * 100}%`,
      color: i % 2 === 0 ? "#60a5fa" : "#06b6d4",
      duration: 2 + rnd3 * 3,
      delay: rnd1 * 2,
    };
  });
}

export default function HologramEffect() {
  const [scanPosition, setScanPosition] = useState(0);
  const [flickerDots] = useState(() => generateFlickerDots());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 扫描线 */}
      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
        style={{
          top: `${scanPosition}%`,
          background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.8), transparent)",
          boxShadow: "0 0 20px rgba(124,58,237,0.6), 0 0 40px rgba(124,58,237,0.4)",
          transition: "top 0.016s linear",
        }}
      />

      {/* 水平网格线 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 49px,
            rgba(124,58,237,0.03) 49px,
            rgba(124,58,237,0.03) 50px
          )`,
        }}
      />

      {/* 垂直网格线 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 49px,
            rgba(59,130,246,0.03) 49px,
            rgba(59,130,246,0.03) 50px
          )`,
        }}
      />

      {/* RGB 色差效果 */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(255,0,0,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(0,255,0,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(0,0,255,0.1) 0%, transparent 50%)
          `,
          animation: "rgbShift 8s ease-in-out infinite",
        }}
      />

      {/* 边缘发光 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: `
            inset 0 0 100px rgba(124,58,237,0.1),
            inset 0 0 50px rgba(59,130,246,0.1)
          `,
        }}
      />

      {/* 闪烁光点 */}
      {mounted && flickerDots.map((dot) => (
        <div
          key={dot.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: dot.left,
            top: dot.top,
            background: dot.color,
            boxShadow: `0 0 10px ${dot.color}`,
            animation: `flicker ${dot.duration}s ease-in-out infinite`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes rgbShift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
          75% { transform: translate(2px, 2px); }
        }

        @keyframes flicker {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

