/**
 * NewAPI 客户端
 * 用于与 NewAPI 代理层交互
 */

const NEWAPI_BASE_URL = process.env.NEWAPI_BASE_URL || 'http://38.190.178.91:3204';

export interface NewAPIConfig {
  baseUrl?: string;
  apiKey: string;
}

export interface VideoGenerationRequest {
  model: string;
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  [key: string]: any;
}

export interface VideoGenerationResponse {
  id: string;
  status: string;
  created_at: string;
  estimated_time?: number;
  [key: string]: any;
}

export interface VideoStatusResponse {
  id: string;
  status: string;
  progress?: number;
  video_url?: string;
  thumbnail_url?: string;
  created_at: string;
  completed_at?: string;
  error?: string;
  [key: string]: any;
}

export class NewAPIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: NewAPIConfig) {
    this.baseUrl = config.baseUrl || NEWAPI_BASE_URL;
    this.apiKey = config.apiKey;
  }

  /**
   * 生成视频
   * 通过 NewAPI 代理到火山引擎
   */
  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    // NewAPI 会将请求转发到配置的火山引擎渠道
    // 使用火山引擎的原始 API 路径
    const response = await fetch(`${this.baseUrl}/api/v3/contents/generations/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        content: [
          {
            type: 'text',
            text: request.prompt,
          },
        ],
        parameters: {
          duration: request.duration || 5,
          aspect_ratio: request.aspectRatio || '16:9',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[NewAPI] Video generation error:', data);
      throw new Error(data.error?.message || data.message || 'Failed to generate video');
    }

    return data;
  }

  /**
   * 检查视频状态
   * 使用火山引擎原始 API 格式
   */
  async checkVideoStatus(taskId: string): Promise<VideoStatusResponse> {
    const response = await fetch(`${this.baseUrl}/api/v3/contents/generations/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'Failed to check video status');
    }

    return data;
  }

  /**
   * 获取可用模型列表
   */
  async getModels(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/v1/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get models');
    }

    return data;
  }

  /**
   * 测试 API Key 是否有效
   */
  async testApiKey(): Promise<boolean> {
    try {
      await this.getModels();
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * 创建 NewAPI 客户端实例
 */
export function createNewAPIClient(apiKey: string, baseUrl?: string): NewAPIClient {
  return new NewAPIClient({
    apiKey,
    baseUrl,
  });
}

