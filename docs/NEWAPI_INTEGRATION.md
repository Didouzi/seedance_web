# NewAPI 集成文档

## 📋 概述

本项目已集成 NewAPI 作为 API 代理层,实现统一的 API 管理和多渠道支持。

## 🏗️ 架构

```
前端 (Next.js)
    ↓
Next.js API Routes
    ├─ /api/generate - 生成视频
    ├─ /api/check-status - 检查状态
    ├─ /api/videos - 视频历史管理
    └─ /api/newapi/test - 测试 API Key
    ↓
NewAPI (http://38.190.178.91:3204)
    ├─ API Key 管理
    ├─ 额度控制
    ├─ 负载均衡
    └─ 多渠道支持
    ↓
AI 服务商
    ├─ 火山引擎 Seedance
    ├─ OpenAI Sora
    └─ 其他服务商
```

## 🔧 配置步骤

### 1. 在 NewAPI 中创建 API Key

1. 访问 NewAPI 管理后台: http://38.190.178.91:3204
2. 登录管理员账号
3. 进入 "令牌管理" 页面
4. 点击 "新建令牌"
5. 设置令牌名称、额度等参数
6. 复制生成的 API Key (格式: `sk-xxxxx`)

### 2. 配置火山引擎渠道

1. 在 NewAPI 中进入 "渠道管理"
2. 点击 "新建渠道"
3. 选择渠道类型: "自定义"
4. 配置参数:
   - 名称: `火山引擎 Seedance`
   - Base URL: `https://ark.cn-beijing.volces.com`
   - API Key: 您的火山引擎 API Key
   - 模型映射:
     - `doubao-seedance-1-5-pro-251215` → Seedance 1.5 Pro
     - `doubao-seedance-2-0-260128` → Seedance 2.0

### 3. 配置环境变量

在项目根目录的 `.env` 文件中:

```env
NEWAPI_BASE_URL="http://38.190.178.91:3204"
NEWAPI_API_KEY="sk-xxxxx"  # 从 NewAPI 获取的 API Key
```

## 📝 使用方法

### 前端使用

在 Generator 页面:

1. 输入 NewAPI 的 API Key (格式: `sk-xxxxx`)
2. 点击 "Save" 保存
3. 选择模型并输入提示词
4. 点击 "Generate Video"

### API 调用示例

#### 生成视频

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "sk-xxxxx",
    "prompt": "A beautiful sunset over the ocean",
    "model": "Seedance 1.5 Pro",
    "duration": 5,
    "aspectRatio": "16:9"
  }'
```

#### 检查状态

```bash
curl -X POST http://localhost:3000/api/check-status \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "sk-xxxxx",
    "videoId": "task-xxxxx"
  }'
```

#### 测试 API Key

```bash
curl -X POST http://localhost:3000/api/newapi/test \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "sk-xxxxx"
  }'
```

## 🎯 优势

### 1. 统一管理
- 所有 API Key 在 NewAPI 中统一管理
- 支持多个服务商的 API Key
- 方便切换和负载均衡

### 2. 额度控制
- 在 NewAPI 中设置每个 Key 的额度
- 实时监控使用情况
- 防止超额使用

### 3. 安全性
- 真实的 API Key 不暴露给前端
- 使用 NewAPI 的代理 Key
- 支持 IP 白名单等安全策略

### 4. 扩展性
- 轻松添加新的 AI 服务商
- 支持多模型切换
- 统一的接口格式

## 🔍 故障排查

### API Key 无效

**问题**: 提示 "NewAPI Key 无效"

**解决方案**:
1. 检查 API Key 格式是否正确 (应为 `sk-xxxxx`)
2. 在 NewAPI 管理后台确认 Key 是否启用
3. 检查 Key 的额度是否用完
4. 使用 `/api/newapi/test` 端点测试

### 无法连接 NewAPI

**问题**: 提示连接错误

**解决方案**:
1. 检查 NewAPI 服务是否运行: `curl http://38.190.178.91:3204/api/status`
2. 检查网络连接
3. 检查 `.env` 中的 `NEWAPI_BASE_URL` 配置

### 模型不可用

**问题**: 提示模型未激活或不存在

**解决方案**:
1. 在 NewAPI 中检查渠道配置
2. 确认火山引擎 API Key 有权限访问该模型
3. 检查模型 ID 映射是否正确

## 📚 相关文档

- [NewAPI 官方文档](https://github.com/Calcium-Ion/new-api)
- [火山引擎 Seedance API](https://www.volcengine.com/docs/82379/1520757)
- [项目 API 集成文档](./API_INTEGRATION.md)

