import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Get the current driver's session
    const session = request.cookies.get('session');
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all pending SOS requests
    const sosRequests = await User.aggregate([
      {
        $match: {
          'sos.status': 'pending'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          'sos.status': 1,
          'sos.createdAt': 1
        }
      },
      {
        $sort: {
          'sos.createdAt': -1
        }
      }
    ]);

    // Format the response
    const formattedRequests = sosRequests.map(user => ({
      _id: user._id,
      userId: {
        name: user.name,
        location: user.location
      },
      status: user.sos.status,
      createdAt: user.sos.createdAt
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error('Failed to fetch SOS requests:', error);
    return NextResponse.json(
      { message: 'Failed to fetch SOS requests' },
      { status: 500 }
    );
  }
}