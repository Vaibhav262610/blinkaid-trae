import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Driver from '@/models/Driver';
import User from '@/models/User';
import Notification from '@/models/Notification';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { action, reason } = await request.json();
    const { id } = params;

    const application = await Driver.findById(id).populate('userId');
    if (!application) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Update user role to driver
      await User.findByIdAndUpdate(application.userId._id, { role: 'driver' });
      
      // Save user credentials in driver document
      application.email = application.userId.email;
      application.password = application.userId.password; // Add password
      application.phone = application.userId.phone;
      application.status = 'approved';
      application.approvedAt = new Date();
      await application.save();
      
      // Create notification
      await Notification.create({
        userId: application.userId._id,
        title: 'Driver Application Approved',
        message: 'Your driver application has been approved. You can now login as a driver.',
        type: 'success'
      });
    } else if (action === 'reject') {
      // Create rejection notification
      await Notification.create({
        userId: application.userId._id,
        title: 'Driver Application Rejected',
        message: reason || 'Your driver application has been rejected.',
        type: 'error'
      });
      
      // Delete the application
      await application.delete();
    }

    return NextResponse.json(
      { message: `Application ${action}ed successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to process driver application:', error);
    return NextResponse.json(
      { message: 'Failed to process driver application' },
      { status: 500 }
    );
  }
}