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

    const user = await User.findById(session.value);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const driver = await Driver.findOne({ email: user.email, status: 'approved' });
    return NextResponse.json({ isDriver: !!driver });
  } catch (error) {
    console.error('Failed to check driver status:', error);
    return NextResponse.json(
      { message: 'Failed to check driver status' },
      { status: 500 }
    );
  }
}