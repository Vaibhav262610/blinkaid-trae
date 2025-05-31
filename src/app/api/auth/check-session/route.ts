import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = request.cookies.get('session');

    if (!session) {
      return NextResponse.json(
        { message: 'No session found' },
        { status: 401 }
      );
    }

    const user = await User.findById(session.value);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid session' },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Session check failed:', error);
    return NextResponse.json(
      { message: 'Session check failed' },
      { status: 500 }
    );
  }
}