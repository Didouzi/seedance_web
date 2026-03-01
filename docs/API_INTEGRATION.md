# Seedance API 集成文档

## 概述

本项目已完成 Seedance API 的完整集成，用户可以使用自己的 API 密钥在 Generator 页面生成 AI 视频。

## 功能特性

### 1. API 密钥管理
- ✅ 用户可以输入自己的 Seedance API 密钥
- ✅ 密钥自动保存到浏览器 localStorage
- ✅ 支持显示/隐藏密钥
- ✅ 一键清除已保存的密钥

### 2. 视频生成
- ✅ Text to Video - 文本生成视频
- ✅ Image to Video - 图片生成视频（UI 已准备，需要添加图片上传功能）
- ✅ 支持多种 AI 模型选择（Seedance 2.0, Sora 2, Veo 3, Kling V3）
- ✅ 丰富的参数配置：
  - 视频时长（3-10秒）
  - 分辨率（720p, 1080p, 4K）
  - 宽高比（16:9, 9:16, 1:1, 4:3）
  - 相机运动（Pan, Tilt, Zoom, Orbit, Static）
  - 运动强度（1-5级）
  - 帧率（24fps, 30fps, 60fps）

### 3. 实时状态跟踪
- ✅ 生成进度条显示
- ✅ 自动轮询检查视频状态
- ✅ 完成后自动显示视频预览
- ✅ 错误提示和处理

### 4. 视频下载
- ✅ 生成完成后可直接下载视频
- ✅ 支持在线预览

## 技术实现

### 后端 API 路由

#### 1. `/api/generate` - 生成视频
```typescript
POST /api/generate
Content-Type: application/json

{
  "apiKey": "sk-...",
  "prompt": "视频描述",
  "model": "Seedance 2.0",
  "duration": 5,
  "aspectRatio": "16:9",
  "cameraMovement": "Static",
  "motionIntensity": 3,
  "fps": 24,
  "quality": "1080p"
}
```

**响应：**
```json
{
  "id": "vid_xxxxxxxxxxxxxxxx",
  "status": "processing",
  "created_at": "2026-02-28T10:30:00Z",
  "estimated_time": 60
}
```

#### 2. `/api/check-status` - 检查视频状态
```typescript
POST /api/check-status
Content-Type: application/json

{
  "apiKey": "sk-...",
  "videoId": "vid_xxxxxxxxxxxxxxxx"
}
```

**响应（处理中）：**
```json
{
  "id": "vid_xxxxxxxxxxxxxxxx",
  "status": "processing",
  "progress": 50
}
```

**响应（完成）：**
```json
{
  "id": "vid_xxxxxxxxxxxxxxxx",
  "status": "completed",
  "video_url": "https://cdn.seedance.com/videos/...",
  "created_at": "2026-02-28T10:30:00Z"
}
```

### 前端实现

#### 状态管理
```typescript
const [apiKey, setApiKey] = useState("");           // API 密钥
const [generating, setGenerating] = useState(false); // 生成状态
const [videoId, setVideoId] = useState<string | null>(null);  // 视频 ID
const [videoUrl, setVideoUrl] = useState<string | null>(null); // 视频 URL
const [progress, setProgress] = useState(0);         // 生成进度
const [error, setError] = useState<string | null>(null);      // 错误信息
```

#### 轮询机制
- 提交生成请求后，获得 `videoId`
- 每 3 秒轮询一次 `/api/check-status`
- 根据返回的 `status` 更新 UI：
  - `processing` - 继续轮询，更新进度
  - `completed` - 显示视频，停止轮询
  - `failed` - 显示错误，停止轮询

## 官方 API 信息

### API 端点
- **生成视频**: `POST https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks`
- **查询状态**: `GET https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/{id}`

### 官方文档
- [Seedance 2.0 API 参考](https://www.volcengine.com/docs/82379/1520757)
- [查询视频生成任务](https://www.volcengine.com/docs/82379/1521309)
- [火山方舟平台](https://www.volcengine.com/docs/82379/1399008)

## 使用指南

### 1. 获取 API 密钥
访问 [火山引擎方舟平台](https://console.volcengine.com/ark) 注册账号并获取 API 密钥。

### 2. 配置密钥
1. 访问 Generator 页面
2. 在顶部的 "Seedance API Key" 输入框中粘贴您的密钥
3. 点击 "Save" 保存（密钥会保存到浏览器本地）

### 3. 生成视频
1. 选择生成模式（Text to Video 或 Image to Video）
2. 输入视频描述（prompt）
3. 选择 AI 模型
4. 配置视频参数（时长、分辨率、相机运动等）
5. 点击 "🎬 Generate Video"
6. 等待生成完成（约 60 秒）
7. 预览并下载视频

## 安全性

- ✅ API 密钥仅保存在用户浏览器本地（localStorage）
- ✅ 后端 API 路由不会记录或存储用户的 API 密钥
- ✅ 所有 API 调用都通过 HTTPS 加密传输
- ✅ 支持密钥显示/隐藏功能

## 下一步优化

### 建议功能
1. **图片上传** - 完善 Image to Video 模式的图片上传功能
2. **历史记录** - 保存用户的生成历史
3. **批量生成** - 支持一次生成多个视频
4. **高级设置** - 添加更多高级参数（种子值、负面提示词等）
5. **预设模板** - 提供常用场景的参数预设

### 性能优化
1. 使用 WebSocket 替代轮询，实时推送生成状态
2. 添加请求缓存，避免重复调用
3. 实现断点续传，支持大文件下载

## 故障排查

### 常见问题

**Q: 提示 "API key is required"**
- 确保已输入并保存 API 密钥

**Q: 提示 "Failed to generate video"**
- 检查 API 密钥是否有效
- 确认账户余额是否充足
- 检查网络连接

**Q: 视频一直在生成中**
- 正常情况下需要 30-60 秒
- 如果超过 2 分钟，刷新页面重试

**Q: 无法下载视频**
- 检查浏览器是否阻止了下载
- 尝试右键 "另存为"

