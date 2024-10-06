import "@/drizzle/envConfig";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export const getUsers = async () => {
  return db.query.users.findMany();
};

// Queries

export const getUserResume = async (userId: string) => {
  const userIdAsNumber = Number(userId); // Convert string to number to avoid overload of text to num
  if (isNaN(userIdAsNumber)) {
    throw new Error("Invalid userId");
  }
  return db.query.resumes.findFirst({
    where: (resumes, { eq }) => eq(resumes.userId, userIdAsNumber),
  });
};


export const getUserResumes = async (userId: string) => {
  const userIdAsNumber = Number(userId); // Convert string to number
  if (isNaN(userIdAsNumber)) {
    throw new Error("Invalid userId");
  }
  return db.query.resumes.findMany({
    where: (resumes, { eq }) => eq(resumes.userId, userIdAsNumber),
  });
};


export const getResumeDetails = async (resumeId: number) => {
  const resume = await db.query.resumes.findFirst({
    where: (resumes, { eq }) => eq(resumes.id, resumeId),
  });

  const workExperiences = await db.query.workExperiences.findMany({
    where: (workExperiences, { eq }) => eq(workExperiences.resumeId, resumeId),
  });

  const projects = await db.query.projects.findMany({
    where: (projects, { eq }) => eq(projects.resumeId, resumeId),
  });

  const activities = await db.query.activities.findMany({
    where: (activities, { eq }) => eq(activities.resumeId, resumeId),
  });

  const skills = await db.query.skills.findMany({
    where: (skills, { eq }) => eq(skills.resumeId, resumeId),
  });

  return {
    resume,
    workExperiences,
    projects,
    activities,
    skills,
  };
};
