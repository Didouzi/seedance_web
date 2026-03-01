# NewAPI 配置指南 - 添加火山引擎 Seedance

## 📋 当前状态

- ✅ NewAPI 服务运行正常: http://38.190.178.91:3204
- ✅ API Key 已创建: `sk-gDvGrUUeijzCJ4IMdBvIlh5EfDT7JXPFXHH47blIvpYDs1Wm`
- ⚠️ 需要添加火山引擎 Seedance 渠道

## 🔧 配置步骤

### 步骤 1: 登录 NewAPI 管理后台

1. 访问: http://38.190.178.91:3204
2. 使用管理员账号登录

### 步骤 2: 添加火山引擎渠道

1. 点击左侧菜单 **"渠道"** 或 **"Channels"**
2. 点击右上角 **"添加渠道"** 按钮
3. 填写以下信息:

#### 基本信息
- **渠道名称**: `火山引擎 Seedance`
- **渠道类型**: 选择 `自定义` 或 `Custom`
- **状态**: 启用

#### API 配置
- **Base URL**: `https://ark.cn-beijing.volces.com`
- **API Key**: `bf263175-8699-4678-84f5-98659a1fe2e1` (您的火山引擎 API Key)

#### 模型配置
在 "模型映射" 或 "Model Mapping" 中添加:

```
doubao-seedance-1-5-pro-251215
doubao-seedance-2-0-260128
```

或者使用自定义名称映射:
```
seedance-1.5-pro -> doubao-seedance-1-5-pro-251215
seedance-2.0 -> doubao-seedance-2-0-260128
```

#### 高级配置 (可选)
- **优先级**: 1
- **权重**: 1
- **超时时间**: 300 秒
- **最大重试次数**: 3

### 步骤 3: 测试渠道

1. 保存渠道配置
2. 在渠道列表中找到刚创建的渠道
3. 点击 **"测试"** 按钮
4. 确认测试通过

### 步骤 4: 验证模型可用性

在终端运行:

```bash
curl -s -X GET "http://38.190.178.91:3204/v1/models" \
  -H "Authorization: Bearer sk-gDvGrUUeijzCJ4IMdBvIlh5EfDT7JXPFXHH47blIvpYDs1Wm" \
  | jq '.data[] | select(.id | contains("seedance"))'
```

应该能看到 Seedance 模型列表。

## 🎯 配置完成后的测试

### 测试 1: 验证模型列表

```bash
curl -X POST http://localhost:3000/api/newapi/test \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "sk-gDvGrUUeijzCJ4IMdBvIlh5EfDT7JXPFXHH47blIvpYDs1Wm"}'
```

### 测试 2: 生成视频

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "sk-gDvGrUUeijzCJ4IMdBvIlh5EfDT7JXPFXHH47blIvpYDs1Wm",
    "prompt": "A beautiful sunset over the ocean",
    "model": "Seedance 1.5 Pro",
    "duration": 5,
    "aspectRatio": "16:9"
  }'
```

### 测试 3: 运行完整测试脚本

```bash
./scripts/test-newapi.sh
```

输入 API Key: `sk-gDvGrUUeijzCJ4IMdBvIlh5EfDT7JXPFXHH47blIvpYDs1Wm`

## 📝 NewAPI 渠道配置参考

### 方式 1: 通过 Web 界面 (推荐)

如上述步骤所示,通过 NewAPI 管理后台的图形界面配置。

### 方式 2: 通过 API 配置

如果您有管理员 Token,可以通过 API 直接创建渠道:

```bash
curl -X POST "http://38.190.178.91:3204/api/channel" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "火山引擎 Seedance",
    "type": 15,
    "base_url": "https://ark.cn-beijing.volces.com",
    "key": "bf263175-8699-4678-84f5-98659a1fe2e1",
    "models": "doubao-seedance-1-5-pro-251215,doubao-seedance-2-0-260128",
    "status": 1,
    "priority": 1
  }'
```

## 🔍 故障排查

### 问题 1: 渠道测试失败

**可能原因**:
- Base URL 不正确
- API Key 无效或过期
- 网络连接问题

**解决方案**:
1. 检查 Base URL 是否为 `https://ark.cn-beijing.volces.com`
2. 验证火山引擎 API Key 是否有效
3. 测试网络连接: `curl https://ark.cn-beijing.volces.com/api/v3/models`

### 问题 2: 模型不显示

**可能原因**:
- 模型映射配置错误
- 渠道未启用

**解决方案**:
1. 检查模型 ID 拼写是否正确
2. 确认渠道状态为 "启用"
3. 刷新模型列表

### 问题 3: 生成视频失败

**可能原因**:
- 模型未激活 (如 Seedance 2.0)
- API Key 额度不足
- 请求参数格式不正确

**解决方案**:
1. 使用 Seedance 1.5 Pro (已激活)
2. 检查 NewAPI 中的额度使用情况
3. 查看 NewAPI 日志获取详细错误信息

## 📚 相关资源

- [NewAPI 官方文档](https://github.com/Calcium-Ion/new-api)
- [火山引擎 API 文档](https://www.volcengine.com/docs/82379/1520757)
- [项目集成文档](./NEWAPI_INTEGRATION.md)

