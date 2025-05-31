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

    const application = await Driver.findById(id);
    if (!application) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Update user role to driver
      await User.findByIdAndUpdate(application.userId, { role: 'driver' });
      
      // Update driver status
      application.status = 'approved';
      application.approvedAt = new Date();
      await application.save();

      // Create notification
      await Notification.create({
        userId: application.userId,
        title: 'Driver Application Approved',
        message: 'Congratulations! Your driver application has been approved. You can now log in as a driver.',
        type: 'success'
      });
    } else if (action === 'reject') {
      // Create rejection notification before deleting
      await Notification.create({
        userId: application.userId,
        title: 'Driver Application Rejected',
        message: `Your driver application was rejected. Reason: ${reason}`,
        type: 'error'
      });

      // Delete the application
      await Driver.findByIdAndDelete(id);
    }

    return NextResponse.json({
      message: `Application ${action}d successfully`
    });
  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json(
      { message: 'Failed to update application' },
      { status: 500 }
    );
  }
}