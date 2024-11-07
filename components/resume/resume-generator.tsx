/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
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
import { getResumeDetails, getUserResume } from "@/server/db/db";
import { useSession } from "next-auth/react";
import { useResumeStore } from "@/store/resume-store";

export default function ResumeGenerator() {
  const [hasResume, setHasResume] = useState(false); // State to track if there's an existing resume
  const [isFormOpen, setIsFormOpen] = useState(false); // State to track if the resume form is open
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const store = useResumeStore();

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  useEffect(() => {
    const fetchUserResume = async () => {
      if (!userId) return;

      try {
        const userResume = await getUserResume(userId);
        if (userResume) {
          const { id: resumeId } = userResume;
          const resumeDetails = await getResumeDetails(resumeId);
          console.log("Resume details:", resumeDetails);
          console.log(userId);

          // Transform and set each section in Zustand store
          if (resumeDetails.personalInfo) {
            const personalInfo = resumeDetails.personalInfo.map((info) => ({
              fullName: info.fullName,
              location: info.location,
              email: info.email,
              contactNumber: info.contactNumber ?? "", // Set default for optional fields
              github: info.github ?? undefined,
              linkedIn: info.linkedIn ?? undefined,
            }))[0]; // Assuming only one personalInfo entry
            store.updatePersonalInfo(personalInfo);
          }

          if (resumeDetails.skills) {
            const skills = resumeDetails.skills.map((skill) => ({
              category: skill.category ?? "", // Ensure category is a string
              items: skill.items ?? [], // Directly use the items array
            }));
            store.updateSkillsInfo({ skills });
          }

          if (resumeDetails.education) {
            const education = resumeDetails.education.map((edu) => ({
              school: edu.school,
              degree: edu.degree,
              from: new Date(edu.from),
              to: new Date(edu.to),
            }));
            store.updateEducationInfo({ education });
          }

          if (resumeDetails.workExperiences) {
            const experiences = resumeDetails.workExperiences.map((exp) => ({
              company: exp.company,
              position: exp.position,
              from: new Date(exp.from),
              to: exp.to ? new Date(exp.to) : undefined,
              description: exp.description ?? "",
            }));
            store.updateExperienceInfo({ experiences });
          }

          if (resumeDetails.projects) {
            const projects = resumeDetails.projects.map((project) => ({
              name: project.name,
              description: project.description,
              from: new Date(project.from),
              to: project.to ? new Date(project.to) : undefined,
              companyName: project.companyName ?? undefined,
            }));
            store.updateProjectsInfo({ projects });
          }

          if (resumeDetails.activities) {
            const activities = resumeDetails.activities.map((activity) => ({
              name: activity.name ?? "",
              role: activity.role ?? "",
              from: new Date(activity.from),
              to: activity.to ? new Date(activity.to) : undefined,
              description: activity.description ?? "",
            }));
            store.updateActivitiesInfo({ activities });
          }

          if (resumeDetails.certifications) {
            const certifications = resumeDetails.certifications.map((cert) => ({
              title: cert.title,
              issuingOrganization: cert.issuingOrganization,
              from: new Date(cert.from),
              to: cert.to ? new Date(cert.to) : undefined,
              credentialID: cert.credentialID ?? undefined,
              credentialURL: cert.credentialURL ?? undefined,
            }));
            store.updateCertificationsInfo({ certifications });
          }

          setHasResume(true);
          console.log("User has a resume with details.");
        } else {
          console.log("No resume found for user.");
        }
      } catch (error) {
        console.error("Error fetching user resume:", error);
      }
    };

    fetchUserResume();
  }, [userId, store]);

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
