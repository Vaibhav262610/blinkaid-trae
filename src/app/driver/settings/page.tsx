'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DriverSettings() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/driver/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="p-4" >
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      {user && (
        <div className="bg-white text-black rounded-lg shadow p-4 mb-4">
          <h2 className="font-bold mb-2">Profile Information</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}