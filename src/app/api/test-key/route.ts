import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // 测试 API Key 是否有效
    // 尝试获取可用的模型列表或端点列表
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      data: data,
      message: response.ok ? 'API Key 有效' : 'API Key 无效或无权限'
    });
  } catch (error) {
    console.error('Test API Key error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

