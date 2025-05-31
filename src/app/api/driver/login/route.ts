import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Driver from '@/models/Driver';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { licenseNumber, password } = await request.json();

    const driver = await Driver.findOne({ licenseNumber, status: 'approved' })
      .populate('userId');

    if (!driver) {
      return NextResponse.json(
        { message: 'Invalid license number or driver not approved' },
        { status: 401 }
      );
    }

    const user = driver.userId;
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create session cookie with proper configuration
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'session',
      value: user._id.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours instead of 10 minutes
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