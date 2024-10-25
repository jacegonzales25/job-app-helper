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
import { create } from "zustand";
import * as db from "@/server/db/db";

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
  isLoading: boolean;
  error: string | null;
  currentResumeId: number | null;
}

// Actions interface
export interface ResumeActions {
  // Fetch operations
  fetchResumeDetails: (resumeId: number) => Promise<void>;

  // Create operations
  createNewResume: (userId: string) => Promise<void>;

  // Update operations
  updatePersonalInfo: (info: PersonalInfo) => Promise<void>;
  updateEducationInfo: (info: EducationInfo) => Promise<void>;
  updateExperienceInfo: (info: ExperienceInfo) => Promise<void>;
  updateSkillsInfo: (info: SkillsInfo) => Promise<void>;
  updateActivitiesInfo: (info: ActivitiesInfo) => Promise<void>;
  updateProjectsInfo: (info: ProjectsInfo) => Promise<void>;
  updateCertificationsInfo: (info: CertificationsInfo) => Promise<void>;

  // Delete operations
  deleteEducation: (educationId: number) => Promise<void>;
  deleteExperience: (experienceId: number) => Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
  deleteSkill: (skillId: number) => Promise<void>;
  deleteActivity: (activityId: number) => Promise<void>;
  deleteCertification: (certificationId: number) => Promise<void>;

  // Utility actions
  clearFormData: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
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
  isLoading: false,
  error: null,
  currentResumeId: null,
};

// Create the store with proper type annotations
export const useResumeStore = create<ResumeStore>((set) => ({
  ...defaultInitState,

  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),

  fetchResumeDetails: async (resumeId: number) => {
    try {
      set({ isLoading: true, error: null });
      const details = await db.getResumeDetails(resumeId);

      set({
        currentResumeId: resumeId,
        personalInfo: {
          fullName: details.personalInfo[0].fullName,
          location: details.personalInfo[0].location,
          email: details.personalInfo[0].email,
          contactNumber: details.personalInfo[0].contactNumber ?? "",
          github: details.personalInfo[0].github || undefined,
          linkedIn: details.personalInfo[0].linkedIn || undefined,
        },
        educationInfo: {
          education: [
            {
              school: details.education[0].school,
              degree: details.education[0].degree,
              from: details.education[0].from || undefined,
              to: details.education[0].to,
            },
          ],
        },
        experienceInfo: {
          experiences: [
            {
              company: details.workExperiences[0].company,
              position: details.workExperiences[0].position,
              from: details.workExperiences[0].from,
              to: details.workExperiences[0].to || undefined,
              description: details.workExperiences[0].description || "",
            },
          ],
        },
        skillsInfo: {
          skills: [
            {
              category: details.skills[0].category,
              items: details.skills[0].items.split(",").map(skill => skill.trim()), // Split and trim each skill  
            
            }
          ]
        }
        activitiesInfo: {
          activities: [
            {
              name: details.activities[0].name,
              role: details.activities[0].role,
              duration: {
                from: details.activities[0].from,
                to: details.activities[0].to || undefined,
              },
              description: details.activities[0].description,
            }
          ]
        }
        projectsInfo: details.projects[0] || null,
        certificationsInfo: details.certifications[0] || null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch resume details",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createNewResume: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const result = await db.insertResume({
        userId: Number(userId),
        isDraft: true,
      });
      const resumeId = result[0].id;
      set({ currentResumeId: resumeId });
      return resumeId;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create new resume",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePersonalInfo: async (info: PersonalInfo) => {
    try {
      set({ isLoading: true, error: null });
      const currentResumeId = useResumeStore.getState().currentResumeId;
      if (!currentResumeId) throw new Error("No resume selected");

      await db.insertPersonalInfo({
        ...info,
        resumeId: currentResumeId,
      });

      set({ personalInfo: info });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update personal info",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateEducationInfo: async (info: EducationInfo) => {
    try {
      set({ isLoading: true, error: null });
      const currentResumeId = useResumeStore.getState().currentResumeId;
      if (!currentResumeId) throw new Error("No resume selected");

      await db.insertEducation({
        ...info,
        resumeId: currentResumeId,
      });

      set({ educationInfo: info });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update education info",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateExperienceInfo: async (info: ExperienceInfo) => {
    try {
      set({ isLoading: true, error: null });
      const currentResumeId = useResumeStore.getState().currentResumeId;
      if (!currentResumeId) throw new Error("No resume selected");

      await db.insertExperience({
        ...info,
        resumeId: currentResumeId,
      });

      set({ experienceInfo: info });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update experience info",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSkillsInfo: async (info: SkillsInfo) => {
    try {
      set({ isLoading: true, error: null });
      const currentResumeId = useResumeStore.getState().currentResumeId;
      if (!currentResumeId) throw new Error("No resume selected");

      await db.insertSkills({
        ...info,
        resumeId: currentResumeId,
      });

      set({ skillsInfo: info });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update skills info",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateActivitiesInfo: async (info: ActivitiesInfo) => {
    try {
      set({ isLoading: true, error: null });
      const currentResumeId = useResumeStore.getState().currentResumeId;
      if (!currentResumeId) throw new Error("No resume selected");

      await db.insertActivity({
        ...info,
        resumeId: currentResumeId,
      });

      set({ activitiesInfo: info });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update activities info",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProjectsInfo: async (info: ProjectsInfo) => {
    try {
      set({ isLoading: true, error: null });
      const currentResumeId = useResumeStore.getState().currentResumeId;
      if (!currentResumeId) throw new Error("No resume selected");

      await db.insertProject({
        ...info,
        resumeId: currentResumeId,
      });

      set({ projectsInfo: info });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update projects info",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateCertificationsInfo: async (info: CertificationsInfo) => {
    try {
      set({ isLoading: true, error: null });
      const currentResumeId = useResumeStore.getState().currentResumeId;
      if (!currentResumeId) throw new Error("No resume selected");

      await db.insertCertification({
        ...info,
        resumeId: currentResumeId,
      });

      set({ certificationsInfo: info });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update certifications info",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteEducation: async (educationId: number) => {
    try {
      set({ isLoading: true, error: null });
      await db.deleteEducation(educationId);
      set({ educationInfo: null });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete education",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteExperience: async (experienceId: number) => {
    try {
      set({ isLoading: true, error: null });
      await db.deleteWorkExperience(experienceId);
      set({ experienceInfo: null });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete experience",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProject: async (projectId: number) => {
    try {
      set({ isLoading: true, error: null });
      await db.deleteProject(projectId);
      set({ projectsInfo: null });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete project",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSkill: async (skillId: number) => {
    try {
      set({ isLoading: true, error: null });
      await db.deleteSkill(skillId);
      set({ skillsInfo: null });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete skill",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteActivity: async (activityId: number) => {
    try {
      set({ isLoading: true, error: null });
      await db.deleteActivity(activityId);
      set({ activitiesInfo: null });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete activity",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCertification: async (certificationId: number) => {
    try {
      set({ isLoading: true, error: null });
      await db.deleteCertification(certificationId);
      set({ certificationsInfo: null });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete certification",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearFormData: () => {
    set({
      ...defaultInitState,
      currentResumeId: null,
    });
  },
}));
