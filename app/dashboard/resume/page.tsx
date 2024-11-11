"use client";

import MultiStepForm from "@/components/multi-page/multi-page-form";
import PersonalForm from "@/components/resume/personal-form";
import EducationForm from "@/components/resume/education-form";
import ExperienceForm from "@/components/resume/experiences-form";
import SkillsForm from "@/components/resume/skills-form";
import ProjectForm from "@/components/resume/projects-form";
import ActivitiesForm from "@/components/resume/activities-form";
import CertificationsForm from "@/components/resume/certifications-form";

export default function Dashboard() {
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
    <div className="min-h-screen bg-gray-100">
      <MultiStepForm
        steps={steps}
        onStepComplete={handleStepComplete}
        onFormComplete={handleFormComplete}
      />
    </div>
  );
}
