import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Driver from '@/models/Driver';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { licenseNumber } = await request.json();

    const driver = await Driver.findOne({ licenseNumber, status: 'approved' })
      .populate('userId');

    if (!driver) {
      return NextResponse.json(
        { message: 'Invalid license number or driver not approved' },
        { status: 401 }
      );
    }

    // Create session cookie
    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set({
      name: 'session',
      value: driver.userId._id.toString(),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Driver login failed:', error);
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}