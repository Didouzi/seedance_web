"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Video {
  id: string;
  taskId: string;
  prompt: string;
  model: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  status: string;
  duration: number | null;
  aspectRatio: string | null;
  createdAt: string;
  completedAt: string | null;
}

export default function MyCreationsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // 从 localStorage 获取 API Key
    const savedApiKey = localStorage.getItem("seedance_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      fetchVideos(savedApiKey);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchVideos = async (key: string) => {
    try {
      const response = await fetch(`/api/videos?apiKey=${encodeURIComponent(key)}`);
      const data = await response.json();

      if (response.ok) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个视频吗?")) return;

    try {
      const response = await fetch(`/api/videos?id=${id}&apiKey=${encodeURIComponent(apiKey)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setVideos(videos.filter(v => v.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">请先设置 API Key</h3>
            <p className="text-gray-600 mb-6">需要 API Key 才能查看您的作品</p>
            <Link
              href="/generator"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3"
            >
              前往生成器
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group">
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-semibold">返回首页</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">我的作品</h1>
          <p className="text-gray-600">查看和管理您的 AI 视频作品</p>
        </div>

        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">加载中...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <svg
              className="mx-auto mb-4 text-gray-300"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有视频</h3>
            <p className="text-gray-600 mb-6">开始创建您的第一个 AI 视频吧</p>
            <Link
              href="/generator"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              创建视频
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                {/* Video Preview */}
                <div className="relative aspect-video bg-gray-900">
                  {(video.status === "completed" || video.status === "succeeded") && video.videoUrl ? (
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      poster={video.thumbnailUrl || undefined}
                    />
                  ) : (video.status === "processing" || video.status === "running") ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        <p className="text-white text-sm">生成中...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white text-sm">生成失败</p>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <p className="text-gray-900 font-medium mb-2 line-clamp-2">{video.prompt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{video.model}</span>
                    {video.duration && <span>{video.duration}s</span>}
                    {video.aspectRatio && <span>{video.aspectRatio}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{formatDate(video.createdAt)}</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {video.videoUrl && (
                      <a
                        href={video.videoUrl}
                        download
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        下载
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="px-3 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

