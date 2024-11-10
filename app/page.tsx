"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, PenTool, Download } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingDashboard() {
  const router = useRouter()
  
  const handleCTAClick = () => {
    router.push("/auth/signup")
  };

  // if (showAuth) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //       <Card className="w-[350px]">
  //         <CardHeader>
  //           <CardTitle>Sign In</CardTitle>
  //           <CardDescription>
  //             Enter your credentials to access your account
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <form>
  //             <div className="grid w-full items-center gap-4">
  //               <div className="flex flex-col space-y-1.5">
  //                 <Input id="email" placeholder="Email" />
  //               </div>
  //               <div className="flex flex-col space-y-1.5">
  //                 <Input id="password" type="password" placeholder="Password" />
  //               </div>
  //             </div>
  //           </form>
  //         </CardContent>
  //         <CardFooter className="flex justify-between">
  //           <Button variant="outline" onClick={() => setShowAuth(false)}>
  //             Cancel
  //           </Button>
  //           <Button>Sign In</Button>
  //         </CardFooter>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-200">
        <a className="flex items-center justify-center" href="#">
          <FileText className="h-6 w-6" />
          <span className="sr-only">Resume Builder</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-x-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Your Next Job is Just One Resume Away
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Build a polished, ATS-friendly resume in minutes with Resume
                  Builder. Use our professional template, customize with ease,
                  and land your dream job. Best of all, it&apos;s completely
                  free!
                </p>
              </div>
              <div className="space-x-4">
                <Button onClick={handleCTAClick} size="lg">
                  Start Building My Resume
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">Use Our Template</h3>
                <p className="text-center text-gray-500">
                  Start with our professional, ATS-friendly resume template
                  designed to impress employers.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
                  <PenTool className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">Customize Content</h3>
                <p className="text-center text-gray-500">
                  Easily input your information and tailor your resume to
                  highlight your unique skills and experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-500">
                  <Download className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">Export and Apply</h3>
                <p className="text-center text-gray-500">
                  Download your polished resume as a DOCX or PDF file, ready to
                  help you land interviews.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Our Professional Template
            </h2>
            <div className="flex justify-center">
              <div className="relative w-full max-w-3xl aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg"
                  alt="Professional Resume Template"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
            <p className="mt-8 text-center text-gray-500">
              This is the professional template you&apos;ll use to create your
              resume. It&apos;s fully customizable to showcase your unique
              skills and experience, and it&apos;s optimized for applicant
              tracking systems (ATS).
            </p>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 Resume Builder. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
