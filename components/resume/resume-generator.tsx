/* eslint-disable no-unused-vars */
"use client";

import React, { useState } from "react";
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
import ResumeTabs from "./resume-tabs";

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
        {!isFormOpen ? (
          <div className="flex flex-col items-center gap-4">
            <Button onClick={handleOpenForm} className="w-1/2">
              Create New Resume
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <ResumeTabs />
            <Button onClick={handleCloseForm} className="w-1/2 mt-4">
              Close Resume Builder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
