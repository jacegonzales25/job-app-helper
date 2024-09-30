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
import { FileText } from "lucide-react";
import PhotoGenerator from "@/components/generator/photo-generator";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* AI Headshot Generator */}
            <PhotoGenerator />
            

            {/* Resume Builder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  Resume Builder
                </CardTitle>
                <CardDescription>
                  Create ATS-optimized resumes with ease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resume-title">Resume Title</Label>
                    <Input
                      id="resume-title"
                      placeholder="e.g., Software Engineer Resume"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1">Create New Resume</Button>
                    <Button variant="outline" className="flex-1">
                      Edit Existing Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Right side: Login component */}
    </div>
  );
}
