"use client";
import { SessionProvider } from "next-auth/react";
import MultiStepForm from "@/components/multi-page/multi-page-form";
import PersonalForm from "@/components/resume/personal-form";
import EducationForm from "@/components/resume/education-form";
import ExperienceForm from "@/components/resume/experiences-form";
import SkillsForm from "@/components/resume/skills-form";

export default function Dashboard() {
  const steps = [
    {
      title: "Personal Information",
      component: <PersonalForm />,
    },
    {
      title: "Education",
      component: <EducationForm />,
    },
    {
      title: "Experience",
      component: <ExperienceForm />,
    },
    {
      title: "Skills",
      component: <SkillsForm />,
    },
  ];

  const handleStepComplete = (stepIndex: number) => {
    console.log(`Step ${stepIndex + 1} completed.`);
  };

  const handleFormComplete = () => {
    console.log("Form completed.");
  };

  return (
    <SessionProvider>
      <MultiStepForm
        steps={steps}
        onStepComplete={handleStepComplete}
        onFormComplete={handleFormComplete}
      />
    </SessionProvider>
  );
}
