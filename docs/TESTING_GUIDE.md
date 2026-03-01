# Generator 功能测试指南

## 🎯 快速测试（推荐）

**无需真实 API 密钥即可测试！**

1. 访问 Generator 页面
2. 在 "Seedance API Key" 输入框中输入 `test-key`
3. 点击 "Save"
4. 输入任意 Prompt
5. 点击 "Generate Video"
6. 系统会模拟生成流程并返回示例视频

**测试模式特点：**
- ✅ 无需注册或付费
- ✅ 立即返回结果
- ✅ 完整测试前端流程
- ✅ 使用真实视频作为示例

## 测试前准备

1. **启动开发服务器**
```bash
npm run dev
```

2. **访问 Generator 页面**
```
http://localhost:3000/en/generator
```

## 测试用例

### 1. API 密钥管理测试

#### 测试 1.1: 保存 API 密钥
- [ ] 在 "Seedance API Key" 输入框中输入测试密钥
- [ ] 点击 "Save" 按钮
- [ ] 验证显示绿色 "Saved" 标记
- [ ] 刷新页面，验证密钥仍然存在

#### 测试 1.2: 显示/隐藏密钥
- [ ] 点击输入框右侧的眼睛图标
- [ ] 验证密钥在明文和密文之间切换

#### 测试 1.3: 清除密钥
- [ ] 点击 "Clear" 按钮
- [ ] 验证密钥被清空
- [ ] 验证 "Saved" 标记消失
- [ ] 刷新页面，验证密钥不再存在

### 2. 表单验证测试

#### 测试 2.1: 空 Prompt 验证
- [ ] 不输入 Prompt
- [ ] 验证 "Generate Video" 按钮被禁用
- [ ] 悬停按钮，验证显示提示信息

#### 测试 2.2: 空 API Key 验证
- [ ] 清除 API 密钥
- [ ] 输入 Prompt
- [ ] 验证 "Generate Video" 按钮被禁用
- [ ] 悬停按钮，验证显示 "Please enter API key"

### 3. 参数配置测试

#### 测试 3.1: 模型选择
- [ ] 点击不同的模型按钮
- [ ] 验证选中状态正确切换
- [ ] 验证右侧 "Current Settings" 显示正确的模型

#### 测试 3.2: 相机运动选择
- [ ] 点击不同的相机运动选项
- [ ] 验证选中状态正确切换
- [ ] 验证右侧 "Current Settings" 显示正确的相机运动

#### 测试 3.3: 滑块控制
- [ ] 拖动 "Motion Intensity" 滑块
- [ ] 验证数值实时更新
- [ ] 拖动 "Duration" 滑块
- [ ] 验证时长实时更新

#### 测试 3.4: 下拉选择
- [ ] 测试 FPS 选择（24/30/60）
- [ ] 测试 Quality 选择（720p/1080p/4K）
- [ ] 测试 Aspect Ratio 选择（16:9/9:16/1:1/4:3）
- [ ] 验证右侧 "Current Settings" 显示正确

### 4. 视频生成测试（需要真实 API 密钥）

#### 测试 4.1: 成功生成
- [ ] 输入有效的 API 密钥
- [ ] 输入 Prompt: "A serene mountain landscape at sunset"
- [ ] 点击 "Generate Video"
- [ ] 验证显示加载动画
- [ ] 验证显示进度条
- [ ] 验证进度条从 0% 增长
- [ ] 等待生成完成（约 60 秒）
- [ ] 验证显示视频预览
- [ ] 验证显示 "Download Video" 按钮

#### 测试 4.2: 视频下载
- [ ] 点击 "Download Video" 按钮
- [ ] 验证视频开始下载
- [ ] 验证下载的视频可以正常播放

#### 测试 4.3: 错误处理 - 无效 API 密钥
- [ ] 输入无效的 API 密钥（如 "invalid-key"）
- [ ] 输入 Prompt
- [ ] 点击 "Generate Video"
- [ ] 验证显示错误提示
- [ ] 验证错误信息清晰明了

#### 测试 4.4: 生成中断测试
- [ ] 开始生成视频
- [ ] 在生成过程中刷新页面
- [ ] 验证状态正确重置

### 5. UI/UX 测试

#### 测试 5.1: 响应式布局
- [ ] 在桌面浏览器测试（> 1024px）
- [ ] 验证左右两栏布局正常
- [ ] 在平板测试（768px - 1024px）
- [ ] 在手机测试（< 768px）
- [ ] 验证布局切换为单栏

#### 测试 5.2: 动画效果
- [ ] 验证按钮悬停效果
- [ ] 验证加载动画流畅
- [ ] 验证进度条动画流畅
- [ ] 验证模式切换动画

#### 测试 5.3: 返回首页
- [ ] 点击左上角 "返回首页" 按钮
- [ ] 验证正确跳转到首页

### 6. 浏览器兼容性测试

- [ ] Chrome（最新版本）
- [ ] Firefox（最新版本）
- [ ] Safari（最新版本）
- [ ] Edge（最新版本）

## 模拟测试（无真实 API 密钥）

如果没有真实的 API 密钥，可以修改代码进行模拟测试：

### 方法 1: 修改后端 API 返回模拟数据

在 `src/app/api/generate/route.ts` 中添加：

```typescript
// 开发环境模拟
if (process.env.NODE_ENV === 'development' && apiKey === 'test-key') {
  return NextResponse.json({
    id: 'vid_test_' + Date.now(),
    status: 'processing',
    created_at: new Date().toISOString(),
    estimated_time: 60
  });
}
```

在 `src/app/api/check-status/route.ts` 中添加：

```typescript
// 开发环境模拟
if (process.env.NODE_ENV === 'development' && apiKey === 'test-key') {
  // 模拟进度
  const progress = Math.min(100, Math.floor(Math.random() * 100));
  
  if (progress >= 100) {
    return NextResponse.json({
      id: videoId,
      status: 'completed',
      video_url: 'https://cdn.seedance2.so/videos/seedance2-hero/20260208-1322/jimeng-2026-02-05-6539.mp4',
      created_at: new Date().toISOString()
    });
  }
  
  return NextResponse.json({
    id: videoId,
    status: 'processing',
    progress
  });
}
```

然后使用 `test-key` 作为 API 密钥进行测试。

## 测试报告模板

```markdown
## 测试日期: YYYY-MM-DD
## 测试人员: [姓名]
## 浏览器: [浏览器名称和版本]

### 测试结果

| 测试用例 | 状态 | 备注 |
|---------|------|------|
| API 密钥保存 | ✅/❌ | |
| API 密钥显示/隐藏 | ✅/❌ | |
| 表单验证 | ✅/❌ | |
| 参数配置 | ✅/❌ | |
| 视频生成 | ✅/❌ | |
| 视频下载 | ✅/❌ | |
| 错误处理 | ✅/❌ | |
| 响应式布局 | ✅/❌ | |

### 发现的问题

1. [问题描述]
2. [问题描述]

### 建议

1. [改进建议]
2. [改进建议]
```

