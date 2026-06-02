import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notice from '@/models/Notice';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const notice = await Notice.findById(id);
    if (!notice) {
      return NextResponse.json({ success: false, error: 'Notice not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const notice = await Notice.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!notice) {
      return NextResponse.json({ success: false, error: 'Notice not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      return NextResponse.json({ success: false, error: 'Notice not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
