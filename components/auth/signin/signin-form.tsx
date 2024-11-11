'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Github } from 'lucide-react';
export default function LoginForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] p-4">
      <Card className="w-full max-w-md overflow-hidden border-0 shadow-lg">
        <CardHeader className="space-y-1 border-b bg-white px-6 py-8">
          <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">
            Sign in to AI Resume Builder
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Choose your preferred sign-in method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 bg-white px-6 py-8">
          <Button 
            variant="outline" 
            className="w-full justify-start border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" 
            onClick={() => {}}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" 
            onClick={() => {}}
          >
            <Github className="mr-2 h-5 w-5" />
            Continue with GitHub
          </Button>
          <div className="text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-gray-700">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-gray-700">Privacy Policy</a>.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}