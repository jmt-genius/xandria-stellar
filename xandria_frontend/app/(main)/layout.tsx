"use client";

import Navbar from "@/components/navbar";
import NotificationContainer from "@/components/notification";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        {children}
      </main>
      <NotificationContainer />
    </>
  );
}
