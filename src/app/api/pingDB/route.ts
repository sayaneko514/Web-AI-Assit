import { dbConnect } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    const con = await dbConnect();
    return new NextResponse('Database connected is online');
}