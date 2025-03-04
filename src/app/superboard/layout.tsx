'use client';

import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { LuLayoutDashboard, LuVideo, LuPalette, LuZap, LuUser } from 'react-icons/lu';

export default function SuperboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useClerk();
  const pathname = usePathname();
  console.log(user?.publicMetadata.role);

  // Check if user is superadmin
  useEffect(() => {
    if(user){
    console.log(user?.publicMetadata.role);
    if(user?.publicMetadata.role !== 'superadmin') {  
      router.push('/dashboard');
    }
  }
  }, [user, router]);

  const menuItems = [
    {
      href: '/superboard',
      label: t('superadmin.menu.dashboard'),
      icon: LuLayoutDashboard
    },
    {
      href: '/superboard/videos',
      label: t('superadmin.menu.videos'),
      icon: LuVideo
    },
    {
      href: '/superboard/styles',
      label: t('superadmin.menu.styles'),
      icon: LuPalette
    },
    {
      href: '/superboard/prompts',
      label: t('superadmin.menu.prompts'),
      icon: LuZap
    },
    {
      href: '/superboard/profile',
      label: t('superadmin.menu.profile'),
      icon: LuUser
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/superboard" className="text-xl font-bold text-gray-900">
            {t('superadmin.title')}
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="pt-16">
        <div className="mx-auto flex max-w-7xl">
          {/* Sidebar */}
          <aside className="fixed h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="ml-64 flex-1 p-8">
            {pathname === '/superboard/profile' ? (
              children
            ) : (
              <div className="mx-auto max-w-4xl">
                {children}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {t('common.copyright')}
            </p>
            <div className="flex space-x-4">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                {t('common.terms')}
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                {t('common.privacy')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 