"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface VideoStatus {
  id: string;
  status: 'processing' | 'completed' | 'failed' | 'running';
  video_url?: string;
  thumbnail_url?: string;
  error?: string;
  progress?: number;
}

interface VideoHistory {
  id: string;
  prompt: string;
  model: string;
  status: 'completed' | 'processing' | 'failed' | 'running';
  videoUrl?: string;
  thumbnailUrl?: string;
  date: string;
  duration: number;
  aspectRatio: string;
}

export default function GeneratorPage() {
  const params = useParams();
  const locale = params.locale as string || 'en';
  const { data: session, status } = useSession();

  const [mode, setMode] = useState<"text" | "image">("text");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [quality, setQuality] = useState("1080p");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [model, setModel] = useState("Seedance 2.0");
  const [cameraMovement, setCameraMovement] = useState("Static");
  const [motionIntensity, setMotionIntensity] = useState(3);
  const [fps, setFps] = useState(24);
  const [generating, setGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // API 密钥相关 - 从 localStorage 读取
  const [apiKey, setApiKey] = useState("");

  // 视频生成相关
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // 历史记录
  const [videoHistory, setVideoHistory] = useState<VideoHistory[]>([]);

  const models = ["Seedance 1.5 Pro", "Seedance 2.0", "Sora 2", "Veo 3", "Kling V3"];
  const cameraOptions = ["Pan Left", "Pan Right", "Tilt Up", "Tilt Down", "Zoom In", "Zoom Out", "Orbit", "Static"];

  // 提示词示例
  const promptExamples = [
    "A serene mountain landscape at golden hour with misty valleys",
    "Futuristic city street with neon lights and flying cars in the rain",
    "Ocean waves crashing against rocky cliffs during a dramatic sunset",
    "Enchanted forest with glowing mushrooms and fireflies at night",
  ];



  // 从数据库加载默认 API 密钥和历史记录
  useEffect(() => {
    if (status === 'authenticated') {
      loadApiKey();
      loadHistory();
    }
  }, [status]);

  // 加载默认 API 密钥
  const loadApiKey = async () => {
    try {
      const response = await fetch('/api/api-keys');
      if (response.ok) {
        const data = await response.json();
        const defaultKey = data.apiKeys.find((k: any) => k.isDefault);
        if (defaultKey) {
          setApiKey(defaultKey.key);
        }
      }
    } catch (error) {
      console.error('Failed to load API key:', error);
    }
  };

  // 从数据库加载历史记录
  const loadHistory = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        // 转换数据库格式到前端格式
        const history: VideoHistory[] = data.videos.map((v: any) => ({
          id: v.taskId,
          prompt: v.prompt,
          model: v.model,
          status: v.status,
          videoUrl: v.videoUrl,
          thumbnailUrl: v.thumbnailUrl,
          date: v.createdAt,
          duration: v.duration || 5,
          aspectRatio: v.aspectRatio || '16:9',
        }));
        setVideoHistory(history);
      }
    } catch (error) {
      console.error('Failed to load video history:', error);
    }
  };

  // 保存历史记录到数据库
  const saveToHistory = async (video: VideoHistory) => {
    // 立即更新 UI
    setVideoHistory((prevHistory) => {
      const newHistory = [video, ...prevHistory];
      return newHistory;
    });

    // 保存到数据库
    try {
      await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: video.id,
          prompt: video.prompt,
          model: video.model,
          status: video.status,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          aspectRatio: video.aspectRatio,
          completedAt: video.status === 'completed' ? new Date().toISOString() : null,
        }),
      });
    } catch (error) {
      console.error('Failed to save video to database:', error);
    }
  };

  // 清空所有参数
  const handleReset = () => {
    setPrompt("");
    setDuration(5);
    setQuality("1080p");
    setAspectRatio("16:9");
    setModel("Seedance 2.0");
    setCameraMovement("Static");
    setMotionIntensity(3);
    setFps(24);
    setUploadedImage(null);
    setVideoUrl(null);
    setError(null);
    setProgress(0);
  };

  // 图片上传处理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setMode("image");
      };
      reader.readAsDataURL(file);
    }
  };

  // 拖拽上传
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setMode("image");
      };
      reader.readAsDataURL(file);
    }
  };

  // 从数据库重新加载历史记录
  const reloadHistory = async () => {
    if (status === 'authenticated') {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
          const data = await response.json();
          const history: VideoHistory[] = data.videos.map((v: any) => ({
            id: v.taskId,
            prompt: v.prompt,
            model: v.model,
            status: v.status,
            videoUrl: v.videoUrl,
            thumbnailUrl: v.thumbnailUrl,
            date: v.createdAt,
            duration: v.duration || 5,
            aspectRatio: v.aspectRatio || '16:9',
          }));
          setVideoHistory(history);
          console.log('[Frontend] History reloaded, total videos:', history.length);
        }
      } catch (error) {
        console.error('Failed to reload video history:', error);
      }
    }
  };

  // 检查视频状态
  const checkVideoStatus = async (id: string) => {
    try {
      const response = await fetch('/api/check-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          videoId: id,
        }),
      });

      const data: VideoStatus = await response.json();

      console.log('[Frontend] Received status:', data.status, 'for video:', id);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check status');
      }

      if (data.status === 'completed' && data.video_url) {
        setVideoUrl(data.video_url);
        setGenerating(false);
        setProgress(100);

        // 保存到历史记录
        saveToHistory({
          id,
          prompt,
          model,
          status: 'completed',
          videoUrl: data.video_url,
          thumbnailUrl: data.thumbnail_url,
          date: new Date().toISOString(),
          duration,
          aspectRatio,
        });

        // 保存到数据库
        await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey,
            taskId: id,
            prompt,
            model,
            videoUrl: data.video_url,
            thumbnailUrl: data.thumbnail_url,
            status: 'completed',
            duration,
            aspectRatio,
            completedAt: new Date().toISOString(),
          }),
        });

        // 重新加载历史记录以确保UI更新
        await reloadHistory();
      } else if (data.status === 'failed') {
        setError(data.error || 'Video generation failed');
        setGenerating(false);

        // 保存失败状态到数据库
        await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey,
            taskId: id,
            prompt,
            model,
            status: 'failed',
            duration,
            aspectRatio,
          }),
        });

        // 重新加载历史记录
        await reloadHistory();
      } else if (data.status === 'processing' || data.status === 'running') {
        setProgress(data.progress || 50);
        // 继续轮询
        setTimeout(() => checkVideoStatus(id), 3000);
      }

      // 无论什么状态,都重新加载一次历史记录
      await reloadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check status');
      setGenerating(false);
    }
  };

  // 生成视频
  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key first');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setGenerating(true);
    setError(null);
    setVideoUrl(null);
    setProgress(0);

    try {
      // 映射模型名称到模型 ID
      const modelIdMap: Record<string, string> = {
        'Seedance 1.5 Pro': 'doubao-seedance-1-5-pro-251215',
        'Seedance 2.0': 'doubao-seedance-2-0-260128',
      };

      const modelId = modelIdMap[model] || model;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          prompt,
          model: modelId,
          duration,
          aspectRatio,
          cameraMovement,
          motionIntensity,
          fps,
          quality,
          image: uploadedImage, // 发送上传的图片(base64格式)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      setVideoId(data.id);
      setProgress(10);

      // 立即保存到历史记录 (processing 状态)
      saveToHistory({
        id: data.id,
        prompt,
        model,
        status: 'processing',
        videoUrl: undefined,
        thumbnailUrl: undefined,
        date: new Date().toISOString(),
        duration,
        aspectRatio,
      });

      // 保存初始记录到数据库
      await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          taskId: data.id,
          prompt,
          model: modelId,
          status: 'processing',
          duration,
          aspectRatio,
        }),
      });

      // 开始轮询检查状态
      setTimeout(() => checkVideoStatus(data.id), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video');
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Seedance API</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {/* TOOLS */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Tools</div>
            <Link href={`/${locale}/generator`} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">AI Video</span>
            </Link>
          </div>

          {/* DEVELOPERS */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Developers</div>
            <Link href={`/${locale}/api-keys`} className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="text-sm font-medium">API Keys</span>
            </Link>
          </div>

          {/* ACCOUNT */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Account</div>
            <Link href={`/${locale}`} className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">Homepage</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto p-8">
          {/* Back Button */}
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group">
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold">返回首页</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Video Generator</h1>
            <p className="text-gray-600">Turn your ideas into cinematic videos in seconds</p>
          </div>



          <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            {/* API Key Status */}
            {!apiKey && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-yellow-900">No API Key Set</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Please go to{" "}
                      <Link href={`/${locale}/api-keys`} className="underline font-semibold hover:text-yellow-900">
                        API Keys
                      </Link>
                      {" "}to add your API key first.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 text-xs font-semibold mb-3 uppercase tracking-wider">
                Select Model
              </label>
              <div className="space-y-2">
                {models.map((m) => (
                  <button
                    key={m}
                    onClick={() => setModel(m)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 border ${
                      model === m
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">📊</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{m}</span>
                          {m === "Seedance 2.0" && (
                            <>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">New</span>
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded">Featured</span>
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">28</span>
                            </>
                          )}
                        </div>
                        {m === "Seedance 2.0" && (
                          <p className="text-xs text-gray-600">Next-gen video generation with enhanced motion quality and audio support</p>
                        )}
                      </div>
                      {model === m && (
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="mb-6">
              <label className="block text-gray-700 text-xs font-semibold mb-3 uppercase tracking-wider">
                Prompt
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  maxLength={5000}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                  rows={5}
                  placeholder="Describe the video scene you want to create in detail..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500 font-medium">
                  {prompt.length} / 5000
                </div>
              </div>

              {/* Prompt Examples */}
              <div className="mt-3 flex flex-wrap gap-2">
                {promptExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Example {index + 1}
                  </button>
                ))}
              </div>

              {/* Image Upload Area */}
              <div
                className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : uploadedImage
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <div className="space-y-3">
                    <img src={uploadedImage} alt="Uploaded" className="max-h-32 mx-auto rounded-lg" />
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-2">Drag & drop an image or click to upload</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg cursor-pointer transition-colors"
                    >
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Movement */}
            <div className="mb-6">
              <label className="block text-gray-700 text-xs font-semibold mb-3 uppercase tracking-wider">
                Camera Movement
              </label>
              <div className="grid grid-cols-4 gap-2">
                {cameraOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setCameraMovement(option)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      cameraMovement === option
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Motion Intensity */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-700 text-xs font-semibold uppercase tracking-wider">
                  Motion Intensity
                </label>
                <span className="text-sm font-semibold text-gray-900">
                  {motionIntensity === 1 ? 'Subtle' : motionIntensity === 2 ? 'Low' : motionIntensity === 3 ? 'Moderate' : motionIntensity === 4 ? 'High' : 'Extreme'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={motionIntensity}
                onChange={(e) => setMotionIntensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider">Duration</label>
                <div className="relative">
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
                  />
                  <div className="text-center text-gray-900 text-sm font-bold">{duration}s</div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider">FPS</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                >
                  <option value={24}>24 fps</option>
                  <option value={30}>30 fps</option>
                  <option value={60}>60 fps</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider">Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                >
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="4k">4K Ultra HD</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="4:3">4:3 Classic</option>
                </select>
              </div>
            </div>

            {/* Cost Display */}
            <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <span className="text-gray-700 text-sm font-medium">Cost</span>
                </div>
                <span className="text-gray-900 text-lg font-bold">28 cost</span>
              </div>
            </div>

            {/* Info Message */}
            <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-blue-700 font-medium">Click Generate to get free credits and start creating!</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt || !apiKey || generating}
                className="py-3 rounded-lg font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative group uppercase tracking-wider flex items-center justify-center gap-2"
                style={{
                  background: (!prompt || !apiKey || generating)
                    ? "#9ca3af"
                    : "#1f2937",
                }}
              >
              {generating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2 relative">
                  <span className="text-xl">⚡</span>
                  Generate Video
                  {(!apiKey || !prompt) && (
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {!apiKey ? "Please enter API key" : "Please enter prompt"}
                    </span>
                  )}
                </span>
              )}
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="flex gap-6 mb-6 border-b border-gray-200">
              <button className="pb-3 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                Preview
              </button>
              <button className="pb-3 text-sm font-semibold text-gray-900 border-b-2 border-gray-900">
                Explore
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-red-400 text-sm font-medium">Error</p>
                    <p className="text-red-300/80 text-xs mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Video Preview Area */}
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 mb-6 overflow-hidden">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              ) : generating ? (
                <div className="text-center px-4">
                  <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <p className="text-gray-900 font-bold mb-2">Generating your video...</p>

                  {/* Progress Bar */}
                  <div className="w-full max-w-xs mx-auto mb-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">{progress}% complete</p>
                  </div>

                  <p className="text-sm text-gray-600 font-medium">Estimated time: ~60s</p>
                  {videoId && (
                    <p className="text-xs text-gray-500 mt-2 font-mono">ID: {videoId.substring(0, 16)}...</p>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="font-semibold text-gray-900">No video generated yet</p>
                  <p className="text-sm mt-2">Fill in the prompt and click Generate</p>
                </div>
              )}
            </div>

            {/* Download Button */}
            {videoUrl && (
              <a
                href={videoUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mb-6 py-3 px-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Video
              </a>
            )}

            {/* Recent Videos */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Videos</h3>
              {videoHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium">No videos yet</p>
                  <p className="text-xs mt-1">Generate your first video to see it here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {videoHistory.map((video) => (
                    <div
                      key={video.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        {video.thumbnailUrl && (
                          <img
                            src={video.thumbnailUrl}
                            alt="Video thumbnail"
                            className="w-16 h-16 rounded object-cover flex-shrink-0 cursor-pointer"
                            onClick={() => {
                              if (video.videoUrl) {
                                setVideoUrl(video.videoUrl);
                                setPrompt(video.prompt);
                              }
                            }}
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-xs text-blue-600 font-mono font-semibold">{video.id}</code>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              video.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : video.status === "processing" || video.status === "running"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {video.status}
                            </span>
                          </div>
                          <p
                            className="text-sm text-gray-900 font-medium mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer"
                            onClick={() => setPrompt(video.prompt)}
                          >
                            {video.prompt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{new Date(video.date).toLocaleString()}</span>
                              <span>•</span>
                              <span>{video.duration}s</span>
                              <span>•</span>
                              <span>{video.aspectRatio}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {video.videoUrl && video.status === 'completed' && (
                                <button
                                  onClick={() => {
                                    setVideoUrl(video.videoUrl!);
                                    setPrompt(video.prompt);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                  查看视频
                                </button>
                              )}
                              {(video.status === 'processing' || video.status === 'running') && (
                                <button
                                  onClick={async () => {
                                    console.log('[Manual Check] Checking status for:', video.id);
                                    await checkVideoStatus(video.id);
                                  }}
                                  className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold"
                                >
                                  刷新状态
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

