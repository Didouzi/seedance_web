"use client";
import { useEffect, useState } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  gradient?: boolean;
  typewriter?: boolean;
  glitch?: boolean;
}

export default function AnimatedText({
  text,
  className = "",
  gradient = false,
  typewriter = false,
  glitch = false,
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState(typewriter ? "" : text);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!typewriter) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text, typewriter]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const baseStyle = gradient
    ? {
        background: "linear-gradient(90deg, #a78bfa, #60a5fa, #34d399, #60a5fa, #a78bfa)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "gradientFlow 4s linear infinite",
      }
    : {};

  return (
    <>
      <span
        className={`${className} ${glitch ? "glitch-text" : ""}`}
        style={baseStyle}
        data-text={text}
      >
        {displayText}
        {typewriter && showCursor && (
          <span className="inline-block w-0.5 h-[0.9em] bg-purple-400 ml-1 animate-pulse" />
        )}
      </span>

      <style jsx>{`
        @keyframes gradientFlow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .glitch-text {
          position: relative;
          text-shadow: 
            0 0 10px rgba(167, 139, 250, 0.8),
            0 0 20px rgba(167, 139, 250, 0.6),
            0 0 30px rgba(167, 139, 250, 0.4);
          animation: glitchPulse 3s ease-in-out infinite;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }

        .glitch-text::before {
          animation: glitchBefore 2s infinite;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-2px, -2px);
          text-shadow: 2px 0 #ff00de;
        }

        .glitch-text::after {
          animation: glitchAfter 2.5s infinite;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          transform: translate(2px, 2px);
          text-shadow: -2px 0 #00fff9;
        }

        @keyframes glitchPulse {
          0%, 100% { 
            text-shadow: 
              0 0 10px rgba(167, 139, 250, 0.8),
              0 0 20px rgba(167, 139, 250, 0.6),
              0 0 30px rgba(167, 139, 250, 0.4);
          }
          50% { 
            text-shadow: 
              0 0 20px rgba(167, 139, 250, 1),
              0 0 40px rgba(167, 139, 250, 0.8),
              0 0 60px rgba(167, 139, 250, 0.6);
          }
        }

        @keyframes glitchBefore {
          0%, 90%, 100% { transform: translate(0, 0); opacity: 0; }
          91%, 95% { transform: translate(-2px, -2px); opacity: 0.8; }
        }

        @keyframes glitchAfter {
          0%, 85%, 100% { transform: translate(0, 0); opacity: 0; }
          86%, 92% { transform: translate(2px, 2px); opacity: 0.8; }
        }
      `}</style>
    </>
  );
}

