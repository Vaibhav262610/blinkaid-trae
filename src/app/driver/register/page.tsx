'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DriverRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleType: '',
    experience: '',
    documents: {
      licenseImage: '',
      vehicleRegistration: '',
      insurance: ''
    }
  });

  useEffect(() => {
    // Fetch current user's email when component mounts
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const userData = await response.json();
          setFormData(prev => ({
            ...prev,
            email: userData.email
          }));
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/driver/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Your application has been submitted successfully!');
        router.push('/dashboard');
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Driver Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
              value={formData.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password for Driver Account</label>
            <input
              type="password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter password for driver account"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License Number</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
            <select
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.vehicleType}
              onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
            >
              <option value="">Select vehicle type</option>
              <option value="ambulance">Ambulance</option>
              <option value="paramedic">Paramedic Vehicle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              required
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
            />
          </div>

          {/* Document Upload Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Required Documents</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Driver's License</label>
              <input
                type="file"
                required
                accept="image/*,.pdf"
                className="mt-1 block w-full"
                onChange={(e) => setFormData({
                  ...formData,
                  documents: {
                    ...formData.documents,
                    licenseImage: e.target.files?.[0]?.name || ''
                  }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Registration</label>
              <input
                type="file"
                required
                accept="image/*,.pdf"
                className="mt-1 block w-full"
                onChange={(e) => setFormData({
                  ...formData,
                  documents: {
                    ...formData.documents,
                    vehicleRegistration: e.target.files?.[0]?.name || ''
                  }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Insurance</label>
              <input
                type="file"
                required
                accept="image/*,.pdf"
                className="mt-1 block w-full"
                onChange={(e) => setFormData({
                  ...formData,
                  documents: {
                    ...formData.documents,
                    insurance: e.target.files?.[0]?.name || ''
                  }
                })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}