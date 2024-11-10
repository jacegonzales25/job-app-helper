"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading/loading";
import ResumeGenerator from "../resume/resume-generator";

export default function DashboardContent() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to check session:", error);
        setIsAuthenticated(false);
        router.push("/");
      }
    };

    checkSession();
  }, [router]);

  if (isAuthenticated === null) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null; // Or a fallback UI while redirecting
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* AI Headshot Generator */}
            {/* <PhotoGenerator /> */}

            {/* Resume Builder */}
            <ResumeGenerator />
          </div>
        </main>
      </div>
    </div>
  );
}
