"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedLanguage, setSelectedLanguage] = useState("curl");
  const t = useTranslations('apiDocsPage');
  const params = useParams();
  const locale = params.locale as string;

  const tabs = [
    { id: "overview", label: t('tabs.overview') },
    { id: "authentication", label: t('tabs.authentication') },
    { id: "endpoints", label: t('tabs.endpoints') },
    { id: "examples", label: t('tabs.examples') },
  ];

  const languages = ["curl", "python", "javascript", "php"];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Back Button */}
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group">
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">{t('backToHome')}</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            API <span className="gradient-text">{t('title')}</span>
          </h1>
          <p className="text-white/50 text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-4 sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                  {t('quickLinks.title')}
                </h4>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-white/60 hover:text-blue-400 transition-colors">
                    {t('quickLinks.getApiKey')}
                  </a>
                  <a href="#" className="block text-sm text-white/60 hover:text-blue-400 transition-colors">
                    {t('quickLinks.rateLimits')}
                  </a>
                  <a href="#" className="block text-sm text-white/60 hover:text-blue-400 transition-colors">
                    {t('quickLinks.statusPage')}
                  </a>
                  <a href="#" className="block text-sm text-white/60 hover:text-blue-400 transition-colors">
                    {t('quickLinks.support')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "overview" && (
              <>
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">{t('overview.gettingStarted')}</h2>
                  <p className="text-white/70 mb-6">
                    {t('overview.intro')}
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-3xl mb-2">🚀</div>
                      <h3 className="font-semibold text-white mb-2">{t('overview.features.fast.title')}</h3>
                      <p className="text-sm text-white/60">{t('overview.features.fast.desc')}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-3xl mb-2">🎯</div>
                      <h3 className="font-semibold text-white mb-2">{t('overview.features.reliable.title')}</h3>
                      <p className="text-sm text-white/60">{t('overview.features.reliable.desc')}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-3xl mb-2">📹</div>
                      <h3 className="font-semibold text-white mb-2">{t('overview.features.scalable.title')}</h3>
                      <p className="text-sm text-white/60">{t('overview.features.scalable.desc')}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-4">{t('overview.baseUrl')}</h3>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-green-400 mb-6">
                    https://api.seedance.com/v1
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-4">{t('overview.quickExample')}</h3>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
                    <pre>{`curl -X POST https://api.seedance.com/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "Seedance 2.0",
    "prompt": "A serene mountain landscape at sunset",
    "duration": 5
  }'`}</pre>
                  </div>
                </div>
              </>
            )}

            {activeTab === "authentication" && (
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">{t('authentication.title')}</h2>
                <p className="text-white/70 mb-6">
                  {t('authentication.intro')}
                </p>

                <h3 className="text-xl font-semibold text-white mb-4">{t('authentication.gettingKey')}</h3>
                <ol className="list-decimal list-inside space-y-2 text-white/70 mb-6">
                  {t.raw('authentication.steps').map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>

                <h3 className="text-xl font-semibold text-white mb-4">{t('authentication.headerFormat')}</h3>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto mb-6">
                  <pre>{`Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</pre>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="text-yellow-500 text-xl">⚠️</div>
                    <div>
                      <h4 className="font-semibold text-yellow-500 mb-1">{t('authentication.security.title')}</h4>
                      <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
                        {t.raw('authentication.security.items').map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "endpoints" && (
              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">API Endpoints</h2>

                  {/* Generate Video Endpoint */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">POST</span>
                      <code className="text-blue-400 font-mono">/v1/generate</code>
                    </div>
                    <p className="text-white/70 mb-4">Generate a new AI video from text or image prompt.</p>

                    <h4 className="font-semibold text-white mb-3">Request Body</h4>
                    <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-white/80 overflow-x-auto mb-4">
                      <pre>{`{
  "model": "Seedance 2.0",           // Required: Model name
  "prompt": "string",                // Required: Text description
  "image_url": "string",             // Optional: Image URL for image-to-video
  "duration": 5,                     // Optional: 3-10 seconds (default: 5)
  "aspect_ratio": "16:9",            // Optional: 16:9, 9:16, 1:1, 4:3
  "camera_movement": "Static",       // Optional: Pan Left, Zoom In, etc.
  "motion_intensity": 3,             // Optional: 1-5 (default: 3)
  "quality": "high"                  // Optional: low, medium, high
}`}</pre>
                    </div>

                    <h4 className="font-semibold text-white mb-3">Response</h4>
                    <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-white/80 overflow-x-auto">
                      <pre>{`{
  "id": "vid_xxxxxxxxxxxxxxxx",
  "status": "processing",
  "created_at": "2026-02-27T10:30:00Z",
  "estimated_time": 60
}`}</pre>
                    </div>
                  </div>

                  {/* Get Video Status */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</span>
                      <code className="text-blue-400 font-mono">/v1/videos/:id</code>
                    </div>
                    <p className="text-white/70 mb-4">Check the status of a video generation request.</p>

                    <h4 className="font-semibold text-white mb-3">Response</h4>
                    <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-white/80 overflow-x-auto">
                      <pre>{`{
  "id": "vid_xxxxxxxxxxxxxxxx",
  "status": "completed",
  "video_url": "https://cdn.seedance.com/videos/xxx.mp4",
  "thumbnail_url": "https://cdn.seedance.com/thumbs/xxx.jpg",
  "duration": 5,
  "created_at": "2026-02-27T10:30:00Z",
  "completed_at": "2026-02-27T10:31:15Z"
}`}</pre>
                    </div>
                  </div>

                  {/* List Videos */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">GET</span>
                      <code className="text-blue-400 font-mono">/v1/videos</code>
                    </div>
                    <p className="text-white/70 mb-4">List all your generated videos.</p>

                    <h4 className="font-semibold text-white mb-3">Query Parameters</h4>
                    <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-white/80 overflow-x-auto">
                      <pre>{`?limit=20&offset=0&status=completed`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "examples" && (
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Code Examples</h2>

                {/* Language Selector */}
                <div className="flex gap-2 mb-6">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedLanguage === lang
                          ? "bg-blue-600 text-white"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Code Examples */}
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
                  {selectedLanguage === "curl" && (
                    <pre>{`# Generate a video
curl -X POST https://api.seedance.com/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "Seedance 2.0",
    "prompt": "A serene mountain landscape at sunset",
    "duration": 5,
    "aspect_ratio": "16:9"
  }'

# Check video status
curl -X GET https://api.seedance.com/v1/videos/vid_xxx \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
                  )}

                  {selectedLanguage === "python" && (
                    <pre>{`import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.seedance.com/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Generate a video
response = requests.post(
    f"{BASE_URL}/generate",
    headers=headers,
    json={
        "model": "Seedance 2.0",
        "prompt": "A serene mountain landscape at sunset",
        "duration": 5,
        "aspect_ratio": "16:9"
    }
)

video_id = response.json()["id"]
print(f"Video ID: {video_id}")

# Check status
status_response = requests.get(
    f"{BASE_URL}/videos/{video_id}",
    headers=headers
)

print(status_response.json())`}</pre>
                  )}

                  {selectedLanguage === "javascript" && (
                    <pre>{`const API_KEY = "YOUR_API_KEY";
const BASE_URL = "https://api.seedance.com/v1";

// Generate a video
async function generateVideo() {
  const response = await fetch(\`\${BASE_URL}/generate\`, {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${API_KEY}\`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "Seedance 2.0",
      prompt: "A serene mountain landscape at sunset",
      duration: 5,
      aspect_ratio: "16:9"
    })
  });

  const data = await response.json();
  console.log("Video ID:", data.id);
  return data.id;
}

// Check status
async function checkStatus(videoId) {
  const response = await fetch(\`\${BASE_URL}/videos/\${videoId}\`, {
    headers: {
      "Authorization": \`Bearer \${API_KEY}\`
    }
  });

  const data = await response.json();
  console.log("Status:", data.status);
  return data;
}

generateVideo().then(checkStatus);`}</pre>
                  )}

                  {selectedLanguage === "php" && (
                    <pre>{`<?php

$apiKey = "YOUR_API_KEY";
$baseUrl = "https://api.seedance.com/v1";

// Generate a video
$ch = curl_init("$baseUrl/generate");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "model" => "Seedance 2.0",
    "prompt" => "A serene mountain landscape at sunset",
    "duration" => 5,
    "aspect_ratio" => "16:9"
]));

$response = curl_exec($ch);
$data = json_decode($response, true);
$videoId = $data["id"];

echo "Video ID: $videoId\\n";

// Check status
$ch = curl_init("$baseUrl/videos/$videoId");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey"
]);

$statusResponse = curl_exec($ch);
$statusData = json_decode($statusResponse, true);

print_r($statusData);

?>`}</pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


