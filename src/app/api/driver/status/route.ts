import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Driver from '@/models/Driver';
import User from '@/models/User';

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
    const user = await User.findById(userId);
    
    if (!user || user.role !== 'driver') {
      return NextResponse.json(
        { message: 'Not authorized as driver' },
        { status: 403 }
      );
    }

    const driver = await Driver.findOne({ userId, status: 'approved' });
    if (!driver) {
      return NextResponse.json(
        { message: 'Driver not found or not approved' },
        { status: 404 }
      );
    }

    return NextResponse.json(driver);
  } catch (error) {
    console.error('Failed to check driver status:', error);
    return NextResponse.json(
      { message: 'Failed to check driver status' },
      { status: 500 }
    );
  }
}