import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export const runtime = 'edge'

export async function POST(req: NextRequest) {

  try{
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse('Missing API Key.', {status: 400 })
    }

    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: 
        `You are Naomi's virtual receptionist, responsible for managing customer inquiries and booking appointments. Your main tasks include:
        1. Provide accurate and helpful responses based on the information available to you.
        2. Assist customers in booking appointments, allowing bookings up to two weeks in advance. If a preferred time slot is unavailable, suggest alternative dates, times, or after-hour options.
        3. For rescheduling, canceling, or after-hour bookings, offer the customer a contact method to reach Naomi directly for further assistance.
        Your goal is to ensure a smooth and pleasant experience for customers while maintaining Naomi's schedule efficiently.`,
      messages: convertToCoreMessages(messages),
    });
    
    return result.toDataStreamResponse();
  } catch (error: any) {
    return new NextResponse(error.message || 'Something went wrong, try refresh the page.', {status: 500})
  }
}