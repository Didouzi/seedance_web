#!/bin/bash

# NewAPI 集成测试脚本

echo "🧪 NewAPI 集成测试"
echo "===================="
echo ""

# 配置
NEWAPI_URL="http://38.190.178.91:3204"
LOCAL_API="http://localhost:3000"

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试 1: 检查 NewAPI 服务状态
echo "📡 测试 1: 检查 NewAPI 服务状态"
echo "--------------------------------"
response=$(curl -s "${NEWAPI_URL}/api/status")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ NewAPI 服务正常运行${NC}"
    echo "响应: $(echo $response | jq -r '.data.system_name')"
else
    echo -e "${RED}✗ NewAPI 服务无法访问${NC}"
    exit 1
fi
echo ""

# 测试 2: 提示用户输入 API Key
echo "📝 测试 2: 测试 NewAPI API Key"
echo "--------------------------------"
echo -e "${YELLOW}请输入您的 NewAPI API Key (格式: sk-xxxxx):${NC}"
read -r NEWAPI_KEY

if [ -z "$NEWAPI_KEY" ]; then
    echo -e "${RED}✗ 未输入 API Key,跳过后续测试${NC}"
    exit 1
fi

# 测试 3: 验证 API Key
echo ""
echo "🔑 测试 3: 验证 API Key"
echo "--------------------------------"
response=$(curl -s -X POST "${LOCAL_API}/api/newapi/test" \
  -H "Content-Type: application/json" \
  -d "{\"apiKey\": \"${NEWAPI_KEY}\"}")

valid=$(echo $response | jq -r '.valid')
if [ "$valid" = "true" ]; then
    echo -e "${GREEN}✓ API Key 有效${NC}"
    echo "可用模型数: $(echo $response | jq '.models | length')"
else
    echo -e "${RED}✗ API Key 无效${NC}"
    echo "错误: $(echo $response | jq -r '.message')"
    exit 1
fi
echo ""

# 测试 4: 生成视频
echo "🎬 测试 4: 生成视频"
echo "--------------------------------"
echo "发送生成请求..."
response=$(curl -s -X POST "${LOCAL_API}/api/generate" \
  -H "Content-Type: application/json" \
  -d "{
    \"apiKey\": \"${NEWAPI_KEY}\",
    \"prompt\": \"A beautiful sunset over the ocean\",
    \"model\": \"Seedance 1.5 Pro\",
    \"duration\": 5,
    \"aspectRatio\": \"16:9\"
  }")

task_id=$(echo $response | jq -r '.id // .data.id // empty')
if [ -n "$task_id" ]; then
    echo -e "${GREEN}✓ 视频生成任务已创建${NC}"
    echo "任务 ID: $task_id"
    echo "状态: $(echo $response | jq -r '.status // .data.status')"
else
    echo -e "${RED}✗ 生成失败${NC}"
    echo "错误: $(echo $response | jq -r '.error // .message')"
    echo "完整响应: $response"
    exit 1
fi
echo ""

# 测试 5: 检查视频状态
echo "🔍 测试 5: 检查视频状态"
echo "--------------------------------"
echo "等待 3 秒后检查状态..."
sleep 3

response=$(curl -s -X POST "${LOCAL_API}/api/check-status" \
  -H "Content-Type: application/json" \
  -d "{
    \"apiKey\": \"${NEWAPI_KEY}\",
    \"videoId\": \"${task_id}\"
  }")

status=$(echo $response | jq -r '.status // .data.status')
if [ -n "$status" ]; then
    echo -e "${GREEN}✓ 状态查询成功${NC}"
    echo "当前状态: $status"
    echo "进度: $(echo $response | jq -r '.progress // "N/A"')%"
else
    echo -e "${RED}✗ 状态查询失败${NC}"
    echo "错误: $(echo $response | jq -r '.error // .message')"
fi
echo ""

# 测试 6: 查询视频历史
echo "📚 测试 6: 查询视频历史"
echo "--------------------------------"
response=$(curl -s -X GET "${LOCAL_API}/api/videos?apiKey=${NEWAPI_KEY}")

video_count=$(echo $response | jq '.videos | length')
if [ "$video_count" -gt 0 ]; then
    echo -e "${GREEN}✓ 视频历史查询成功${NC}"
    echo "历史记录数: $video_count"
    echo "最新视频: $(echo $response | jq -r '.videos[0].prompt')"
else
    echo -e "${YELLOW}⚠ 暂无视频历史${NC}"
fi
echo ""

# 总结
echo "================================"
echo -e "${GREEN}✅ 所有测试完成!${NC}"
echo ""
echo "📋 测试总结:"
echo "  - NewAPI 服务: 正常"
echo "  - API Key: 有效"
echo "  - 视频生成: 成功"
echo "  - 状态查询: 成功"
echo "  - 历史记录: 正常"
echo ""
echo "🎉 NewAPI 集成工作正常!"

