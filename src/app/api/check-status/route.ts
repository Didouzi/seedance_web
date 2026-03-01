import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, videoId } = body;

    // 验证参数
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // 开发环境模拟模式（用于测试）
    if (process.env.NODE_ENV === 'development' && apiKey === 'test-key') {
      console.log('[DEV MODE] Simulating status check for video:', videoId);

      // 模拟视频生成完成
      return NextResponse.json({
        id: videoId,
        status: 'completed',
        progress: 100,
        video_url: 'https://cdn.seedance2.so/videos/seedance2-hero/20260208-1322/jimeng-2026-02-05-6539.mp4',
        thumbnail_url: 'https://cdn.seedance2.so/videos/seedance2-hero/20260208-1322/jimeng-2026-02-05-6539.jpg',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      });
    }

    console.log('[Volcano Engine] Checking video status:', videoId);

    // 直接调用火山引擎 API 检查状态
    const response = await fetch(`https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks/${videoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Volcano Engine] API error:', data);
      return NextResponse.json(
        { error: data.error || 'Failed to check video status' },
        { status: response.status }
      );
    }

    console.log('[Volcano Engine] Status result:', data);

    // 提取视频 URL (火山引擎返回的格式是 data.content.video_url)
    const videoUrl = data.content?.video_url || data.video_url || null;
    const thumbnailUrl = data.content?.thumbnail_url || data.thumbnail_url || null;
    const completedAt = data.status === 'succeeded' ? new Date() : null;

    // 更新数据库中的视频状态
    try {
      const session = await getServerSession(authOptions);

      if (session?.user) {
        const userId = (session.user as any).id;

        await prisma.video.upsert({
          where: {
            taskId: videoId,
          },
          update: {
            status: data.status,
            videoUrl: videoUrl,
            thumbnailUrl: thumbnailUrl,
            completedAt: completedAt,
          },
          create: {
            taskId: videoId,
            userId,
            prompt: 'Unknown',
            model: data.model || 'unknown',
            status: data.status,
            videoUrl: videoUrl,
            thumbnailUrl: thumbnailUrl,
            completedAt: completedAt,
          },
        });
        console.log('[Database] Video status updated:', videoId);
      }
    } catch (dbError) {
      console.error('[Database] Failed to update video status:', dbError);
      // 数据库错误不影响返回结果
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Check status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error. 请确保您使用的是有效的火山引擎 API 密钥。' },
      { status: 500 }
    );
  }
}

