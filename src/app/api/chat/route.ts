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

    const { protocol } = new URL(req.url); 
    const host = req.headers.get('host');

    const fetchServiceDataResponse = await fetch(`${protocol}//${host}/api/fetch-service-data`);
    const serviceData = await fetchServiceDataResponse.json();
    const servicesInfo = serviceData.map((service: any) => {
      return `**${service.service_name}**: $${service.price}`;
    }).join('\n');

    const fetchOpsDataResponse = await fetch(`${protocol}//${host}/api/fetch-ops-data`);
    const operationData = await fetchOpsDataResponse.json();
    const operationInfo = `
      Store Address: ${operationData.find((item: any) => item.address)?.address || "Not Available"}
      Store Hours: ${operationData.find((item: any) => item.store_hour)?.store_hour || "Not Available"}
      Payment Methods: ${(operationData.find((item: any) => item.payment_method)?.payment_method || []).join(', ')}
      After Hour Service Available: ${operationData.find((item: any) => item.after_hour)?.after_hour ? 'Yes' : 'No'}
    `;

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: 
        `You are Naomi's virtual receptionist, responsible for managing customer inquiries and booking appointments. Your main tasks include:
        1. Provide accurate and helpful responses based on the information available to you.
        2. Use ${servicesInfo} to answer inquery regarding to services and prices.
        3. Use ${operationInfo} to answer inquery regarding store infomation and operating hours.
        4. Assist customers in booking appointments, allowing bookings up to two weeks in advance. If a preferred time slot is unavailable, suggest alternative dates, times, or after-hour options.
        5. For rescheduling, canceling, or after-hour bookings, offer the customer a contact method to reach Naomi directly for further assistance.
        Your goal is to ensure a smooth and pleasant experience for customers while maintaining Naomi's schedule efficiently.`,
      messages: convertToCoreMessages(messages),
    });
    
    return result.toDataStreamResponse();
  } catch (error: any) {
    return new NextResponse(error.message || 'Something went wrong, try refresh the page.', {status: 500})
  }
}

function useState<T>(arg0: never[]): [any, any] {
  throw new Error('Function not implemented.');
}
