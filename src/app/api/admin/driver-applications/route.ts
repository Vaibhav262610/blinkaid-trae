import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Driver from '@/models/Driver';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all driver applications with user details
    const applications = await Driver.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Failed to fetch driver applications:', error);
    return NextResponse.json(
      { message: 'Failed to fetch driver applications' },
      { status: 500 }
    );
  }
}