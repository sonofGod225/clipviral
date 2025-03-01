'use client';

import { LuLayoutDashboard, LuVideo } from "react-icons/lu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const links = [
    {
      href: "/dashboard",
      label: t('navigation.dashboard'),
      icon: LuLayoutDashboard,
    },
    {
      href: "/dashboard/videos",
      label: t('navigation.videos'),
      icon: LuVideo,
    },
  ];

  return (
    <aside className="fixed bottom-0 left-0 top-0 hidden w-64 border-r border-gray-100 bg-white sm:block">
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-semibold">{t('app.name')}</span>
        </Link>
      </div>

      <nav className="mt-6 px-6">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
} 