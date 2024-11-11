"use client";
import ResumeGenerator from "../resume/resume-generator";

export default function DashboardContent() {

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
