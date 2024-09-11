import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema, handleBooking } from '@/utils/bookingSchema';
import { getPSTDate } from '@/utils/getDate';

export const maxDuration = 30;
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse('Missing API Key.', { status: 400 });
    }

    const { messages } = await req.json();
    const { protocol } = new URL(req.url);
    const host = req.headers.get('host');

    const fetchServiceDataResponse = await fetch(`${protocol}//${host}/api/fetchServiceData`);
    const serviceData = await fetchServiceDataResponse.json();
    const servicesInfo = serviceData.map((service: any) => {
      return `**${service.service_name}**: $${service.price}`;
    }).join('\n');

    const fetchOpsDataResponse = await fetch(`${protocol}//${host}/api/fetchOpsData`);
    const operationData = await fetchOpsDataResponse.json();
    const operationInfo = `
      Store Address: ${operationData.find((item: any) => item.address)?.address || "Not Available"}
      Store Hours: ${operationData.find((item: any) => item.store_hour)?.store_hour || "Not Available"}
      Payment Methods: ${(operationData.find((item: any) => item.payment_method)?.payment_method || []).join(', ')}
      After Hour Service Available: ${operationData.find((item: any) => item.after_hour)?.after_hour ? 'Yes' : 'No'}
    `;
    const currentPSTDate = getPSTDate();

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: `
        You are a virtual receptionist for (Nu HairLab), operated by junior hairstylist Naomi Ni. 
        Collect customer's name, phone number, and date for booking and rescheduling.
        Collect customer's phone number for cancellation.
        Confirm the booking information before proceeding with the booking.
        The current date and time is ${currentPSTDate} (PST).
        After booking ask if additional help is needed, do not repeat booking information after confirmation.
        Use the following service info for inquiries: ${servicesInfo}.
        Use the store info for inquiries about operations: ${operationInfo}.
        Ensure a smooth and helpful experience for all inquiries.
      `,
      messages: convertToCoreMessages(messages),
      tools: {
        bookAppointment: {
          description: "Get booking information from the customer and handle appointment logic.",
          parameters: bookingSchema,
          execute: handleBooking,
        },
      },
      experimental_toolCallStreaming: true,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    return new NextResponse(error.message || 'Something went wrong, try refreshing the page.', { status: 500 });
  }
}