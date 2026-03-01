import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// 生成 API Key 的哈希值
function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

// GET - 获取用户的视频列表
export async function GET(request: NextRequest) {
  try {
    // TODO: 需要用户认证后启用
    // 暂时返回空数组
    return NextResponse.json({ videos: [] });

    /*
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // 获取该用户的所有视频,按创建时间倒序
    const videos = await prisma.video.findMany({
      where: {
        userId: 'temp-user-id', // 需要从 session 获取
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ videos });
    */
  } catch (error) {
    console.error('Get videos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST - 保存新的视频记录
export async function POST(request: NextRequest) {
  try {
    // TODO: 需要用户认证后启用
    // 暂时返回成功
    return NextResponse.json({ success: true });

    /*
    const body = await request.json();
    const {
      taskId,
      prompt,
      model,
      videoUrl,
      thumbnailUrl,
      status,
      duration,
      aspectRatio,
      completedAt,
    } = body;

    if (!taskId || !prompt || !model) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 创建或更新视频记录
    const video = await prisma.video.upsert({
      where: {
        taskId,
      },
      update: {
        videoUrl,
        thumbnailUrl,
        status,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
      create: {
        taskId,
        userId: 'temp-user-id', // 需要从 session 获取
        prompt,
        model,
        videoUrl,
        thumbnailUrl,
        status: status || 'processing',
        duration,
        aspectRatio,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
    });

    return NextResponse.json({ video });
    */
  } catch (error) {
    console.error('Save video error:', error);
    return NextResponse.json(
      { error: 'Failed to save video', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE - 删除视频记录
export async function DELETE(request: NextRequest) {
  try {
    // TODO: 需要用户认证后启用
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}

