'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check-session');
        if (!response.ok) {
          router.replace('/auth/login');
        }
      } catch (error) {
        router.replace('/auth/login');
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/check-session');
      if (!response.ok) {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      window.location.href = '/auth/login';
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/unread-count');
      if (response.ok) {
        const { count } = await response.json();
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <Link 
            href="/dashboard"
            className={`flex flex-col items-center ${pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <span className="material-icons">home</span>
            <span className="text-xs">Home</span>
          </Link>

          <Link 
            href="/dashboard/history"
            className={`flex flex-col items-center ${pathname === '/dashboard/history' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <span className="material-icons">history</span>
            <span className="text-xs">History</span>
          </Link>

          <Link 
            href="/dashboard/notifications"
            className={`flex flex-col items-center relative ${pathname === '/dashboard/notifications' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <span className="material-icons">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
            <span className="text-xs">Notifications</span>
          </Link>

          <Link 
            href="/dashboard/settings"
            className={`flex flex-col items-center ${pathname === '/dashboard/settings' ? 'text-indigo-600' : 'text-gray-500'}`}
          >
            <span className="material-icons">settings</span>
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}