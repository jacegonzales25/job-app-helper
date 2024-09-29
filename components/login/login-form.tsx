"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState('');

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Welcome to AI Pro Shots
          </CardTitle>
          <CardDescription>
            Generate professional headshots and build ATS-optimized resumes with
            AI.
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
  );
}
