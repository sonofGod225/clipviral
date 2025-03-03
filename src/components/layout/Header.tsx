'use client';

import { LuBell, LuMenu, LuX } from "react-icons/lu";
import { UserMenu } from "@/components/ui/UserMenu";
import { UserResource } from "@clerk/types";
import { useMobileSidebar } from "@/store/use-mobile-sidebar";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

interface HeaderProps {
  user: UserResource | null | undefined;
}

export function Header({ user }: HeaderProps) {
  const { isOpen, toggle } = useMobileSidebar();
  const { t } = useTranslation();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-gray-100 bg-white sm:left-64">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {/* Burger Menu Button - Only on mobile */}
          <button
            onClick={toggle}
            className="mr-2 rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50 sm:hidden"
          >
            {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
          </button>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{t('header.tokens')}:</span>
            <span className="font-medium text-gray-900">100/45</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <button className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200" title={t('header.notifications')}>
            <LuBell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <UserMenu />
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{user?.fullName || t('header.guest')}</p>
              <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 