import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - 获取用户的统计数据
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // 获取总视频数量
    const totalVideos = await prisma.video.count({
      where: {
        userId,
      },
    });

    // 获取成功的视频数量
    const completedVideos = await prisma.video.count({
      where: {
        userId,
        status: 'completed',
      },
    });

    // 获取失败的视频数量
    const failedVideos = await prisma.video.count({
      where: {
        userId,
        status: 'failed',
      },
    });

    // 计算成功率
    const successRate = totalVideos > 0 
      ? ((completedVideos / totalVideos) * 100).toFixed(1) 
      : '0.0';

    // API Calls = 总视频数量(每次生成视频都是一次 API 调用)
    const apiCalls = totalVideos;

    // 获取上周的数据用于计算增长率
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const videosLastWeek = await prisma.video.count({
      where: {
        userId,
        createdAt: {
          lt: oneWeekAgo,
        },
      },
    });

    const videosThisWeek = totalVideos - videosLastWeek;
    const videoGrowth = videosLastWeek > 0 
      ? ((videosThisWeek / videosLastWeek) * 100).toFixed(0)
      : videosThisWeek > 0 ? '100' : '0';

    // 计算 API 调用增长率(与视频增长率相同)
    const apiCallGrowth = videoGrowth;

    // 计算成功率变化
    const completedLastWeek = await prisma.video.count({
      where: {
        userId,
        status: 'completed',
        createdAt: {
          lt: oneWeekAgo,
        },
      },
    });

    const successRateLastWeek = videosLastWeek > 0
      ? (completedLastWeek / videosLastWeek) * 100
      : 0;

    const currentSuccessRate = parseFloat(successRate);
    const successRateChange = (currentSuccessRate - successRateLastWeek).toFixed(1);

    return NextResponse.json({
      stats: {
        videosGenerated: {
          value: totalVideos,
          change: `${videoGrowth > '0' ? '+' : ''}${videoGrowth}%`,
          trend: parseInt(videoGrowth) >= 0 ? 'up' : 'down',
        },
        apiCalls: {
          value: apiCalls,
          change: `${apiCallGrowth > '0' ? '+' : ''}${apiCallGrowth}%`,
          trend: parseInt(apiCallGrowth) >= 0 ? 'up' : 'down',
        },
        successRate: {
          value: `${successRate}%`,
          change: `${parseFloat(successRateChange) >= 0 ? '+' : ''}${successRateChange}%`,
          trend: parseFloat(successRateChange) >= 0 ? 'up' : 'down',
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

