import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github } from "lucide-react"

export default function LandingPage() {
  const [email, setEmail] = useState("")

  const carouselItems = [
    { type: "headshot", image: "/placeholder.svg?height=400&width=300", alt: "Professional headshot example 1" },
    { type: "resume", image: "/placeholder.svg?height=400&width=300", alt: "Resume example 1" },
    { type: "headshot", image: "/placeholder.svg?height=400&width=300", alt: "Professional headshot example 2" },
    { type: "resume", image: "/placeholder.svg?height=400&width=300", alt: "Resume example 2" },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Left side: Carousel */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-8">
        <div className="relative w-full max-w-md aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: index === 0 ? 1 : 0 }} // You'll control this with Framer Motion
            >
              <img src={item.image} alt={item.alt} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-lg font-semibold">
                  {item.type === "headshot" ? "Professional Headshot" : "ATS-Optimized Resume"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome to AI Pro Shots</CardTitle>
            <CardDescription>
              Generate professional headshots and build ATS-optimized resumes with AI.
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
  )
}