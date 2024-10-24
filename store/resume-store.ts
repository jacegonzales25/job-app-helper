/* eslint-disable no-unused-vars */
// src/store/resume-store.ts
import { activitiesSchema } from "@/components/resume/activities-form";
import { certificationsSchema } from "@/components/resume/certifications-form";
import { educationSchema } from "@/components/resume/education-form";
import { experienceSchema } from "@/components/resume/experiences-form";
import { personalInfoSchema } from "@/components/resume/personal-form";
import { projectSchema } from "@/components/resume/projects-form";
import { skillsSchema } from "@/components/resume/skills-form";
import { z } from "zod";
import { createStore } from "zustand/vanilla";

// Type definitions from schemas
type PersonalInfo = z.infer<typeof personalInfoSchema>;
type EducationInfo = z.infer<typeof educationSchema>;
type ExperienceInfo = z.infer<typeof experienceSchema>;
type SkillsInfo = z.infer<typeof skillsSchema>;
type ActivitiesInfo = z.infer<typeof activitiesSchema>;
type ProjectsInfo = z.infer<typeof projectSchema>;
type CertificationsInfo = z.infer<typeof certificationsSchema>;

// State interface
export interface ResumeState {
  personalInfo: PersonalInfo | null;
  educationInfo: EducationInfo | null;
  experienceInfo: ExperienceInfo | null;
  skillsInfo: SkillsInfo | null;
  activitiesInfo: ActivitiesInfo | null;
  projectsInfo: ProjectsInfo | null;
  certificationsInfo: CertificationsInfo | null;
}

// Actions interface
export interface ResumeActions {
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateEducationInfo: (info: EducationInfo) => void;
  updateExperienceInfo: (info: ExperienceInfo) => void;
  updateSkillsInfo: (info: SkillsInfo) => void;
  updateActivitiesInfo: (info: ActivitiesInfo) => void;
  updateProjectsInfo: (info: ProjectsInfo) => void;
  updateCertificationsInfo: (info: CertificationsInfo) => void;
  clearFormData: () => void;
}

// Combined store type
export type ResumeStore = ResumeState & ResumeActions;

// Default initial state
export const defaultInitState: ResumeState = {
  personalInfo: null,
  educationInfo: null,
  experienceInfo: null,
  skillsInfo: null,
  activitiesInfo: null,
  projectsInfo: null,
  certificationsInfo: null,
};

// Create the store with proper type annotations
export const createResumeStore = () =>
  createStore<ResumeStore>((set) => ({
    ...defaultInitState,

    updatePersonalInfo: (info: PersonalInfo) =>
      set((state) => ({ ...state, personalInfo: info })),

    updateEducationInfo: (info: EducationInfo) =>
      set((state) => ({ ...state, educationInfo: info })),

    updateExperienceInfo: (info: ExperienceInfo) =>
      set((state) => ({ ...state, experienceInfo: info })),

    updateSkillsInfo: (info: SkillsInfo) =>
      set((state) => ({ ...state, skillsInfo: info })),

    updateActivitiesInfo: (info: ActivitiesInfo) =>
      set((state) => ({ ...state, activitiesInfo: info })),

    updateProjectsInfo: (info: ProjectsInfo) =>
      set((state) => ({ ...state, projectsInfo: info })),

    updateCertificationsInfo: (info: CertificationsInfo) =>
      set((state) => ({ ...state, certificationsInfo: info })),

    clearFormData: () => set(defaultInitState),
  }));