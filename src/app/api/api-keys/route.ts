import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - 获取用户的所有 API keys
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        key: true,
        isDefault: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error('Failed to fetch API keys:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

// POST - 创建新的 API key
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { name, key, isDefault } = await req.json();

    if (!name || !key) {
      return NextResponse.json({ error: 'Name and key are required' }, { status: 400 });
    }

    // 如果设置为默认,先将其他 key 的 isDefault 设为 false
    if (isDefault) {
      await prisma.apiKey.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // 如果是第一个 key,自动设为默认
    const existingKeys = await prisma.apiKey.count({
      where: {
        userId,
      },
    });

    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        name,
        key,
        isDefault: isDefault || existingKeys === 0,
      },
    });

    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error('Failed to create API key:', error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}

// DELETE - 删除 API key
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // 验证 API key 属于当前用户
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    await prisma.apiKey.delete({
      where: {
        id,
      },
    });

    // 如果删除的是默认 key,将第一个 key 设为默认
    if (apiKey.isDefault) {
      const firstKey = await prisma.apiKey.findFirst({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (firstKey) {
        await prisma.apiKey.update({
          where: {
            id: firstKey.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete API key:', error);
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }
}

// PATCH - 设置默认 API key
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // 验证 API key 属于当前用户
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    // 将所有 key 的 isDefault 设为 false
    await prisma.apiKey.updateMany({
      where: {
        userId,
      },
      data: {
        isDefault: false,
      },
    });

    // 将指定 key 设为默认
    await prisma.apiKey.update({
      where: {
        id,
      },
      data: {
        isDefault: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to set default API key:', error);
    return NextResponse.json({ error: 'Failed to set default API key' }, { status: 500 });
  }
}

