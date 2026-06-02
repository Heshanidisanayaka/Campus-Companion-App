import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notice from '@/models/Notice';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const filter = { isPublished: true };
    if (category && category !== 'All') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const notices = await Notice.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notices' }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const notice = await Notice.create(body);
    return NextResponse.json({ success: true, data: notice }, { status: 201 });
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
