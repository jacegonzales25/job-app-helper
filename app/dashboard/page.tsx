import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, FileText, Settings, LogOut, Github } from "lucide-react"

export default function Dashboard() {
  const [email, setEmail] = useState("")

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side: Dashboard content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">AI Pro Shots Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* AI Headshot Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Camera className="h-6 w-6 mr-2" />
                  AI Headshot Generator
                </CardTitle>
                <CardDescription>Transform your photos into professional headshots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="upload-photo">Upload your photo</Label>
                    <Input id="upload-photo" type="file" className="mt-1" />
                  </div>
                  <Button className="sm:self-end">Generate Headshot</Button>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Original Photo</p>
                  </div>
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">AI Generated Headshot</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  Resume Builder
                </CardTitle>
                <CardDescription>Create ATS-optimized resumes with ease</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resume-title">Resume Title</Label>
                    <Input id="resume-title" placeholder="e.g., Software Engineer Resume" className="mt-1" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1">Create New Resume</Button>
                    <Button variant="outline" className="flex-1">Edit Existing Resume</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Right side: Login component */}
      <div className="hidden lg:flex w-96 bg-gray-50 border-l border-gray-200">
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Log in to access your AI-powered tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="github">GitHub</TabsTrigger>
                </TabsList>
                <TabsContent value="email">
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Continue with Email
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="github">
                  <Button variant="outline" className="w-full" onClick={() => {}}>
                    <Github className="w-4 h-4 mr-2" />
                    Continue with GitHub
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}