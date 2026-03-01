import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // 验证 URL 是否来自允许的域名
    const allowedDomains = ['cdn.seedance2.so', 'cdn.seedance.com'];
    const urlObj = new URL(url);
    if (!allowedDomains.includes(urlObj.hostname)) {
      return NextResponse.json(
        { error: 'Invalid video URL' },
        { status: 403 }
      );
    }

    // 获取视频
    const response = await fetch(url, {
      headers: {
        'Range': request.headers.get('range') || 'bytes=0-',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch video' },
        { status: response.status }
      );
    }

    // 创建响应并设置正确的 headers
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'video/mp4');
    headers.set('Content-Length', response.headers.get('Content-Length') || '0');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Cache-Control', 'public, max-age=31536000');
    
    if (response.headers.get('Content-Range')) {
      headers.set('Content-Range', response.headers.get('Content-Range')!);
    }

    const body = await response.arrayBuffer();
    
    return new NextResponse(body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Proxy video error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

