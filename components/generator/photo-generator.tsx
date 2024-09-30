"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

export default function PhotoGenerator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Camera className="h-6 w-6 mr-2" />
          AI Headshot Generator
        </CardTitle>
        <CardDescription>
          Transform your photos into professional headshots
        </CardDescription>
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
          {/* Photo showcase, use Aspect Ratio */}
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Original Photo</p>
          </div>
          {/* Photo showcase, use Aspect Ratio */}
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">AI Generated Headshot</p>
          </div>
        </div>
        <div className="mt-4 justify-end flex">
          <Button className="ml-auto sm:self-end">Download Headshot</Button>
        </div>
      </CardContent>
    </Card>
  );
}
