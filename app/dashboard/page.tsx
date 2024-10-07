"use client";
import { SessionProvider } from "next-auth/react";
import DashboardContent from "@/components/dashboard/dashboard";

export default function Dashboard() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  );
}
