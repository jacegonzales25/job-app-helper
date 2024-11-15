"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Resume Builder</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
