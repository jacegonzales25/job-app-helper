/* eslint-disable no-unused-vars */
'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FileText } from "lucide-react";
import { Button } from "../ui/button";

import ResumeForm from "./resume-form";

export default function ResumeGenerator() {
  const [hasResume, setHasResume] = useState(false); // State to track if there's an existing resume
  const [isFormOpen, setIsFormOpen] = useState(false); // State to track if the resume form is open

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };


  return (
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
        {/* Conditionally render buttons or form */}
            {!isFormOpen ? (
              <div className="flex flex-col items-center gap-4">
                {hasResume ? (
                  <Button onClick={handleOpenForm} className="w-1/2">
                    Edit Existing Resume
                  </Button>
                ) : (
                  <Button onClick={handleOpenForm} className="w-1/2">
                    Create New Resume
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <ResumeForm /> {/* Render the resume form when open */}
                <Button onClick={handleCloseForm} className="w-1/2 mt-4">
                  Close Resume Builder
                </Button>
              </div>
            )}
      </CardContent>
    </Card>
  );
}
