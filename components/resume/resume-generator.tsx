/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FileText } from "lucide-react";
import { Button } from "../ui/button";
import MultiStepForm from "../multi-page/multi-page-form";
import PersonalForm from "./personal-form";
import SkillsForm from "./skills-form";
import EducationForm from "./education-form";
import ExperienceForm from "./experiences-form";
import ProjectForm from "./projects-form";
import ActivitiesForm from "./activities-form";
import CertificationsForm from "./certifications-form";

export default function ResumeGenerator() {
  const [isFormOpen, setIsFormOpen] = useState(false); // State to track if the resume form is open

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const steps = [
    { component: <PersonalForm /> },
    { component: <SkillsForm /> },
    { component: <EducationForm /> },
    { component: <ExperienceForm /> },
    { component: <ProjectForm /> },
    { component: <ActivitiesForm /> },
    { component: <CertificationsForm /> },
  ];

  const handleStepComplete = (stepIndex: number) => {
    console.log(`Step ${stepIndex + 1} completed.`);
  };

  const handleFormComplete = () => {
    console.log("Form completed.");
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
        {/* Conditionally render buttons or the multi-step form */}
        {!isFormOpen ? (
          <div className="flex flex-col items-center gap-4">
            <Button onClick={handleOpenForm} className="w-1/2">
              Create New Resume
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <MultiStepForm
              steps={steps}
              onStepComplete={handleStepComplete}
              onFormComplete={handleFormComplete}
            />
            <Button onClick={handleCloseForm} className="w-1/2 mt-4">
              Close Resume Builder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
