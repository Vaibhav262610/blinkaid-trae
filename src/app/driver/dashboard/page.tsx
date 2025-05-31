'use client';

import { useState, useEffect } from 'react';

interface SOSRequest {
  _id: string;
  userId: {
    name: string;
    location: string;
  };
  status: 'pending' | 'accepted' | 'completed';
  createdAt: string;
}

export default function DriverDashboard() {
  const [requests, setRequests] = useState<SOSRequest[]>([]);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/sos/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SOS Requests</h1>
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{request.userId.name}</h3>
                <p className="text-gray-600">{request.userId.location}</p>
                <p className="text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleAcceptRequest(request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}