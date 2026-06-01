import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Result from '@/models/Result';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Fetch results, optionally filtered by userId
    const filter = userId ? { userId } : {};
    const results = await Result.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch results' }, { status: 400 });
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

    const result = await Result.create(body);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating result:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
