"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
}

export default function ParticleField3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const particleCount = 150;
    const mouse = { x: 0, y: 0, radius: 150 };

    // 调整画布大小
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // 初始化粒子
    const colors = ["#60a5fa", "#3b82f6", "#06b6d4", "#0ea5e9"];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    // 动画循环
    const animate = () => {
      ctx.fillStyle = "rgba(8, 8, 16, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particles.forEach((p, i) => {
        // 3D 透视投影
        const scale = 1000 / (1000 + p.z);
        const x2d = p.x * scale + canvas.width / 2;
        const y2d = p.y * scale + canvas.height / 2;

        // 鼠标交互
        const dx = mouse.x - x2d;
        const dy = mouse.y - y2d;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          p.vx += dx * force * 0.001;
          p.vy += dy * force * 0.001;
        }

        // 更新位置
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // 边界检测
        if (p.z > 1000 || p.z < -500) p.z = -500;
        if (Math.abs(p.x) > canvas.width) p.vx *= -1;
        if (Math.abs(p.y) > canvas.height) p.vy *= -1;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * scale;
        ctx.fill();

        // 绘制连线
        particles.forEach((p2, j) => {
          if (i >= j) return;
          const scale2 = 1000 / (1000 + p2.z);
          const x2d2 = p2.x * scale2 + canvas.width / 2;
          const y2d2 = p2.y * scale2 + canvas.height / 2;
          const dist = Math.sqrt((x2d - x2d2) ** 2 + (y2d - y2d2) ** 2);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(x2d2, y2d2);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 120) * 0.3 * scale;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

