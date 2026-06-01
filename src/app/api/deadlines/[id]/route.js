import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deadline from '@/models/Deadline';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const deadline = await Deadline.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!deadline) {
      return NextResponse.json({ success: false, error: 'Deadline not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deadline });
  } catch (error) {
    console.error('Error updating deadline:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deadline = await Deadline.findByIdAndDelete(id);

    if (!deadline) {
      return NextResponse.json({ success: false, error: 'Deadline not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting deadline:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
