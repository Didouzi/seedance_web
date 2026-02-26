"use client";

export default function MyCreationsPage() {
  return (
    <div className="min-h-screen pt-24 px-4" style={{ background: "#080810" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">My Creations</h1>
          <p className="text-white/60">View and manage your AI-generated videos</p>
        </div>

        {/* Empty State */}
        <div className="glass-card rounded-2xl p-12 text-center">
          <svg 
            className="mx-auto mb-4 text-white/20" 
            width="80" 
            height="80" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <path d="M8 5v14l11-7z"/>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
          <p className="text-white/60 mb-6">Start creating your first AI video</p>
          <a 
            href="/generator"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Video
          </a>
        </div>
      </div>
    </div>
  );
}

