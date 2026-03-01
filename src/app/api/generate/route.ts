import { NextRequest, NextResponse } from 'next/server';
import { createNewAPIClient } from '@/lib/newapi';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 模型名称到 ID 的映射
const modelIdMap: Record<string, string> = {
  'Seedance 1.5 Pro': 'doubao-seedance-1-5-pro-251215',
  'Seedance 2.0': 'doubao-seedance-2-0-260128',
};

// 判断是否使用 NewAPI
const USE_NEWAPI = process.env.USE_NEWAPI === 'true';

export async function POST(request: NextRequest) {
  try {
    // 获取用户 session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const body = await request.json();
    const { apiKey, prompt, model, duration, aspectRatio } = body;

    // 验证 API 密钥
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // 验证 prompt
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 开发环境模拟模式（用于测试）
    if (process.env.NODE_ENV === 'development' && apiKey === 'test-key') {
      console.log('[DEV MODE] Simulating video generation...');
      return NextResponse.json({
        id: 'vid_' + Math.random().toString(36).substring(7),
        status: 'processing',
        created_at: new Date().toISOString(),
        estimated_time: 60
      });
    }

    // 获取模型 ID
    const modelId = modelIdMap[model] || model || 'doubao-seedance-1-5-pro-251215';

    let data;

    if (USE_NEWAPI) {
      // 通过 NewAPI 调用
      console.log('[NewAPI] Generating video with model:', modelId);

      try {
        const newAPIClient = createNewAPIClient(apiKey);
        data = await newAPIClient.generateVideo({
          model: modelId,
          prompt,
          duration: duration || 5,
          aspectRatio: aspectRatio || '16:9',
        });

        console.log('[NewAPI] Generation result:', data);
      } catch (error: any) {
        console.error('[NewAPI] API error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to generate video via NewAPI' },
          { status: 500 }
        );
      }
    } else {
      // 直接调用火山引擎 API
      console.log('[Volcano Engine] Generating video with model:', modelId);

      const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelId,
          content: [
            {
              type: 'text',
              text: prompt,
            },
          ],
          parameters: {
            duration: duration || 5,
            aspect_ratio: aspectRatio || '16:9',
          }
        }),
      });

      data = await response.json();

      if (!response.ok) {
        console.error('[Volcano Engine] API error:', data);
        return NextResponse.json(
          { error: data.error || 'Failed to generate video' },
          { status: response.status }
        );
      }

      console.log('[Volcano Engine] Generation result:', data);
    }

    // 保存到数据库
    try {
      await prisma.video.create({
        data: {
          taskId: data.id,
          userId,
          prompt,
          model: modelId,
          status: data.status || 'processing',
          duration: duration || 5,
          aspectRatio: aspectRatio || '16:9',
        },
      });
      console.log('[Database] Video record saved:', data.id);
    } catch (dbError) {
      console.error('[Database] Failed to save video record:', dbError);
      // 数据库错误不影响返回结果
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Internal server error. 请确保您使用的是有效的火山引擎 API 密钥。' },
      { status: 500 }
    );
  }
}

