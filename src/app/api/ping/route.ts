import { openai } from '@ai-sdk/openai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse('Missing API Key.', { status: 400 });
    }
    
    const testResponse = await openai('gpt-4o-mini')

    if (testResponse) {
      return new NextResponse('GPT API is online', { status: 200 });
    } else {
      return new NextResponse('GPT API is offline', { status: 502 });
    }
  } catch (error: any) {
    return new NextResponse('GPT API is offline: ' + error.message, { status: 502 });
  }
}
