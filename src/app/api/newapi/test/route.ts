import { NextRequest, NextResponse } from 'next/server';
import { createNewAPIClient } from '@/lib/newapi';

/**
 * 测试 NewAPI Key 是否有效
 */
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

    console.log('[NewAPI Test] Testing API key...');

    const client = createNewAPIClient(apiKey);
    
    try {
      // 尝试获取模型列表来验证 API Key
      const models = await client.getModels();
      
      console.log('[NewAPI Test] API key is valid, models:', models);

      return NextResponse.json({
        valid: true,
        message: 'NewAPI Key 有效',
        models: models.data || models,
      });
    } catch (error: any) {
      console.error('[NewAPI Test] API key is invalid:', error);
      
      return NextResponse.json({
        valid: false,
        message: error.message || 'NewAPI Key 无效',
      }, { status: 401 });
    }
  } catch (error) {
    console.error('NewAPI test error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

