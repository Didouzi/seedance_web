"use client";
import { useEffect, useState } from "react";

export default function MouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* 主光晕 */}
      <div
        className="fixed pointer-events-none z-50 transition-opacity duration-300"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* 次级光晕 */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* 光标点 */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
          width: "4px",
          height: "4px",
          background: "#fff",
          borderRadius: "50%",
          boxShadow: "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(167,139,250,0.6)",
        }}
      />
    </>
  );
}

