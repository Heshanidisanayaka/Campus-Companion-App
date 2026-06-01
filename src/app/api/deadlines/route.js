import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deadline from '@/models/Deadline';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Fetch deadlines, optionally filtered by userId, sorted by dueDate ascending
    const filter = userId ? { userId } : {};
    const deadlines = await Deadline.find(filter).sort({ dueDate: 1 });

    return NextResponse.json({ success: true, data: deadlines });
  } catch (error) {
    console.error('Error fetching deadlines:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch deadlines' }, { status: 400 });
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

    const deadline = await Deadline.create(body);
    return NextResponse.json({ success: true, data: deadline }, { status: 201 });
  } catch (error) {
    console.error('Error creating deadline:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
