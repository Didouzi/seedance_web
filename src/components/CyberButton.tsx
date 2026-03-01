"use client";
import { useState } from "react";

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
}

export default function CyberButton({
  children,
  onClick,
  icon,
  variant = "primary",
}: CyberButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1000);

    onClick?.();
  };

  const isPrimary = variant === "primary";

  return (
    <button
      onClick={handleClick}
      className="cyber-button group relative px-10 py-5 text-lg font-bold overflow-hidden"
      style={{
        background: isPrimary
          ? "linear-gradient(135deg, rgba(124,58,237,0.9), rgba(109,40,217,0.9))"
          : "rgba(255,255,255,0.05)",
        border: isPrimary ? "2px solid rgba(167,139,250,0.5)" : "2px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        color: "white",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      {/* 光束流动效果 */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          backgroundSize: "200% 100%",
          animation: "beamFlow 2s linear infinite",
        }}
      />

      {/* 边框霓虹灯效果 */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          borderRadius: "12px",
          boxShadow: isPrimary
            ? "0 0 20px rgba(167,139,250,0.6), 0 0 40px rgba(167,139,250,0.4), inset 0 0 20px rgba(167,139,250,0.2)"
            : "0 0 20px rgba(96,165,250,0.6), 0 0 40px rgba(96,165,250,0.4)",
        }}
      />

      {/* 能量波纹 */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "0px",
            height: "0px",
            background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
            animation: "rippleExpand 1s ease-out forwards",
          }}
        />
      ))}

      {/* 内容 */}
      <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
        {icon}
        {children}
      </span>

      {/* 3D 倾斜效果 */}
      <style jsx>{`
        .cyber-button:hover {
          transform: translateY(-2px) perspective(500px) rotateX(2deg);
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
        }

        .cyber-button:active {
          transform: translateY(0) perspective(500px) rotateX(0deg);
        }

        @keyframes beamFlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes rippleExpand {
          0% {
            width: 0px;
            height: 0px;
            opacity: 1;
          }
          100% {
            width: 400px;
            height: 400px;
            margin-left: -200px;
            margin-top: -200px;
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}

