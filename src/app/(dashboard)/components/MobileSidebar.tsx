'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LuMenu, LuX, LuLayoutDashboard, LuVideo } from 'react-icons/lu';
import { UserResource } from '@clerk/types';
import { UserButton } from '@clerk/nextjs';

interface MobileSidebarProps {
  user: UserResource | null | undefined;
}

export const MobileSidebar = ({ user }: MobileSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Burger Menu Button - Now part of the header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-5 z-50 rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition-all duration-300 hover:bg-gray-50 sm:hidden ${
          isOpen ? 'right-4' : 'left-4'
        }`}
      >
        {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-800/50 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out sm:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500">
                {/* Logo placeholder */}
              </div>
              <h1 className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
                ClipViral
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <LuLayoutDashboard className="h-5 w-5" />
              <span className="text-sm">Create Video</span>
            </Link>
            <Link
              href="/dashboard/videos"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <LuVideo className="h-5 w-5" />
              <span className="text-sm">My Videos</span>
            </Link>
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Guest'}</p>
                <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 