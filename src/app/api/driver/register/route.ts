import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Driver from '@/models/Driver';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Get the current user's ID from the session
    const session = request.cookies.get('session');
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.value;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has a driver application
    const existingApplication = await Driver.findOne({ userId: user._id });
    if (existingApplication) {
      return NextResponse.json(
        { message: 'You have already submitted a driver application' },
        { status: 400 }
      );
    }

    // Create new driver application with user's email and password
    const driver = await Driver.create({
      userId: user._id,
      email: user.email,  // Add user's email
      password: user.password,  // Add user's password
      licenseNumber: data.licenseNumber,
      vehicleNumber: data.vehicleNumber,
      vehicleType: data.vehicleType,
      experience: data.experience,
      documents: data.documents,
      status: 'pending'
    });

    return NextResponse.json(
      { message: 'Application submitted successfully', driver },
      { status: 201 }
    );
  } catch (error) {
    console.error('Driver registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}