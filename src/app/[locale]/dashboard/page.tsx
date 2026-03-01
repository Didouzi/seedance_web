"use client";
import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKey = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  const stats = [
    { label: "Videos Generated", value: "1,234", change: "+12%", trend: "up" },
    { label: "API Calls", value: "45,678", change: "+8%", trend: "up" },
    { label: "Success Rate", value: "99.5%", change: "+0.2%", trend: "up" },
    { label: "Credits Remaining", value: "8,500", change: "-15%", trend: "down" },
  ];

  const recentVideos = [
    { id: "vid_001", prompt: "Mountain landscape at sunset", status: "completed", date: "2026-02-27 10:30" },
    { id: "vid_002", prompt: "City street in rain", status: "completed", date: "2026-02-27 09:15" },
    { id: "vid_003", prompt: "Ocean waves crashing", status: "processing", date: "2026-02-27 08:45" },
    { id: "vid_004", prompt: "Forest path in autumn", status: "completed", date: "2026-02-26 16:20" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group">
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">返回首页</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-white/50 text-lg">
            Monitor your API usage and manage your account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-white/50">{stat.label}</p>
                <span className={`text-xs font-semibold ${
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* API Key Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">API Keys</h2>
              
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white mb-1">Production Key</h3>
                    <p className="text-xs text-white/50">Created on Feb 15, 2026</p>
                  </div>
                  <button className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-semibold rounded hover:bg-red-500/30 transition-colors">
                    Revoke
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <code className="flex-1 bg-black/40 px-4 py-3 rounded font-mono text-sm text-white/80">
                    {showApiKey ? apiKey : "sk-••••••••••••••••••••••••••••••••"}
                  </code>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded text-sm font-medium text-white transition-colors"
                  >
                    {showApiKey ? "Hide" : "Show"}
                  </button>
                  <button className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium text-white transition-colors">
                    Copy
                  </button>
                </div>
              </div>

              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                + Create New API Key
              </button>
            </div>

            {/* Recent Videos */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Videos</h2>
              
              <div className="space-y-3">
                {recentVideos.map((video) => (
                  <div key={video.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-xs text-blue-400 font-mono">{video.id}</code>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        video.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {video.status}
                      </span>
                    </div>
                    <p className="text-sm text-white mb-2">{video.prompt}</p>
                    <p className="text-xs text-white/40">{video.date}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                View All Videos
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Chart */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">API Usage (7 days)</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[65, 80, 45, 90, 70, 85, 95].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-white/40">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors">
                  🎬 Generate Video
                </button>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                  📚 View Documentation
                </button>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                  💳 Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

