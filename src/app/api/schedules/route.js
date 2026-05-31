import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Schedule from '@/models/Schedule';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Fetch schedules, optionally filtered by userId
    const filter = userId ? { userId } : {};
    const schedules = await Schedule.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch schedules' }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Make sure we have a userId. In a real app this comes from session.
    if (!body.userId) {
      body.userId = 'dummy-user-123'; // Default fallback for development
    }

    const schedule = await Schedule.create(body);
    return NextResponse.json({ success: true, data: schedule }, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
