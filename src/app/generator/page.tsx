"use client";
import { useState } from "react";

export default function GeneratorPage() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("5s");
  const [quality, setQuality] = useState("1080p");
  const [aspectRatio, setAspectRatio] = useState("16:9");

  return (
    <div className="min-h-screen pt-24 px-4" style={{ background: "#080810" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">AI Video Generator</h1>
          <p className="text-white/60">Turn your ideas into cinematic videos in seconds</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <div className="glass-card rounded-2xl p-6">
            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMode("text")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  mode === "text"
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Text to Video
              </button>
              <button
                onClick={() => setMode("image")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  mode === "image"
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Image to Video
              </button>
            </div>

            {/* Image Upload (if image mode) */}
            {mode === "image" && (
              <div className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                  <svg 
                    className="mx-auto mb-3 text-white/40" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="text-white/60 text-sm">Click to upload or drag and drop</p>
                  <p className="text-white/40 text-xs mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>
            )}

            {/* Prompt */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-2">
                {mode === "text" ? "Video Description" : "Motion Prompt (Optional)"}
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                rows={4}
                placeholder={mode === "text" 
                  ? "Describe the video you want to create..." 
                  : "Describe the motion or animation..."}
              />
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Duration</label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="5s">5 seconds</option>
                  <option value="8s">8 seconds</option>
                  <option value="10s">10 seconds</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Quality</label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="360p">360p</option>
                  <option value="540p">540p</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Aspect Ratio</label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                  <option value="1:1">1:1 (Square)</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Model</label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50">
                  <option>Seedance 2.0</option>
                  <option>Normal</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button className="btn-primary w-full py-4 text-base font-semibold">
              Generate Video
            </button>
          </div>

          {/* Right Panel - Preview */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Preview</h3>
            <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center border border-white/10">
              <p className="text-white/40">Your generated video will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

