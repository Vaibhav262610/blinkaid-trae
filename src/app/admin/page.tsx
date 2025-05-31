'use client';

import { useEffect, useState } from 'react';

interface DriverApplication {
  _id: string;
  userId: {
    name: string;
    email: string;
    phone: string;
  };
  licenseNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  experience: number;
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    licenseImage: string;
    vehicleRegistration: string;
    insurance: string;
  };
  createdAt: string;
}

export default function AdminPanel() {
  const [applications, setApplications] = useState<DriverApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/driver-applications');
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setError('Failed to load driver applications');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const response = await fetch(`/api/admin/driver-applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, reason })
      });

      if (!response.ok) throw new Error('Failed to update application');
      await fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Action failed:', error);
      alert('Failed to process the application');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (applications.length === 0) return <div className="p-8 text-center">No driver applications found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">Driver Applications</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li key={app._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{app.userId.name}</h3>
                    <div className="mt-1 text-sm text-gray-500 space-y-1">
                      <p>Email: {app.userId.email}</p>
                      <p>Phone: {app.userId.phone}</p>
                      <p>License: {app.licenseNumber}</p>
                      <p>Vehicle: {app.vehicleNumber} ({app.vehicleType})</p>
                      <p>Experience: {app.experience} years</p>
                      <p>Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <h4 className="font-medium">Documents:</h4>
                      <div className="text-sm text-gray-500">
                        <p>License Image: {app.documents.licenseImage}</p>
                        <p>Vehicle Registration: {app.documents.vehicleRegistration}</p>
                        <p>Insurance: {app.documents.insurance}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    {app.status === 'pending' ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => handleAction(app._id, 'approve')}
                          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Please provide rejection reason:');
                            if (reason) handleAction(app._id, 'reject', reason);
                          }}
                          className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}