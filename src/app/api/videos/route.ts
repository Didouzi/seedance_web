import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - 获取用户的视频列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // 获取该用户的所有视频,按创建时间倒序
    const videos = await prisma.video.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // 最多返回 50 条
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Get videos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST - 保存/更新视频记录
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
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
        userId,
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
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // 验证视频属于该用户
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video || video.userId !== userId) {
      return NextResponse.json(
        { error: 'Video not found or unauthorized' },
        { status: 404 }
      );
    }

    // 删除视频记录
    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}

