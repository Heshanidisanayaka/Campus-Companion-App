import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Result from '@/models/Result';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ success: false, error: 'Result not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting result:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
