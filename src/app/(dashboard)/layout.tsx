'use client';

import { useUser } from "@clerk/nextjs";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  return (
    <div className="relative min-h-screen">
      <Header user={user} />
      <Sidebar />
      <MobileSidebar />
      <main className="min-h-screen pt-16 sm:pl-64">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 