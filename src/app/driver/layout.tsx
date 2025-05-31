'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Skip layout for login and register pages
  if (pathname === '/driver/login' || pathname === '/driver/register') {
    return children;
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check-session');
        if (!response.ok) {
          router.replace('/driver/login');
        }
      } catch (error) {
        router.replace('/driver/login');
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <Link 
            href="/driver/dashboard"
            className={`flex flex-col items-center ${pathname === '/driver/dashboard' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <span className="material-icons">home</span>
            <span className="text-xs">Home</span>
          </Link>

          <Link 
            href="/driver/history"
            className={`flex flex-col items-center ${pathname === '/driver/history' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <span className="material-icons">history</span>
            <span className="text-xs">History</span>
          </Link>

          <Link 
            href="/driver/settings"
            className={`flex flex-col items-center ${pathname === '/driver/settings' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <span className="material-icons">settings</span>
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}