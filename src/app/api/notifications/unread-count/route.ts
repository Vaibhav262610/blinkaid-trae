import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const session = request.cookies.get('session');
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.value;
    const count = await Notification.countDocuments({
      userId,
      read: false
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Failed to fetch unread count:', error);
    return NextResponse.json(
      { message: 'Failed to fetch unread count' },
      { status: 500 }
    );
  }
}