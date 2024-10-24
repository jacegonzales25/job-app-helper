import "@/drizzle/envConfig";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";
import { InferModel } from "drizzle-orm";

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

  const personalInfo = await db.query.personalInfo.findMany({
    where: (personalInfo, { eq }) => eq(personalInfo.resumeId, resumeId),
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

  const certifications = await db.query.certifications.findMany({
    where: (certifications, { eq }) => eq(certifications.resumeId, resumeId),
  });

  const education = await db.query.education.findMany({
    where: (education, { eq }) => eq(education.resumeId, resumeId),
  });

  return {
    resume,
    workExperiences,
    projects,
    activities,
    skills,
    certifications,
    education,
    personalInfo,
  };
};

// Types Declaration
type InsertUser = typeof schema.users.$inferInsert;
type InsertResume = typeof schema.resumes.$inferInsert;
type InsertPersonalInfo = typeof schema.personalInfo.$inferInsert;
type InsertSkills = typeof schema.skills.$inferInsert;
type InsertExperieces = typeof schema.workExperiences.$inferInsert;
type InsertProjects = typeof schema.projects.$inferInsert;
type InsertActivities = typeof schema.activities.$inferInsert;
type InsertCertifications = typeof schema.certifications.$inferInsert;

// Insert User
export const insertUser = async (user: InsertUser) => {
  return db.insert(schema.users).values(user);
};

// Insert Resume
export const insertResume = async (resume: InsertResume) => {
  return db.insert(schema.resumes).values(resume);
};

// Insert Personal Info
export const insertPersonalInfo = async (personalInfo: InsertPersonalInfo) => {
  return db.insert(schema.personalInfo).values(personalInfo);
};

// Insert Skills
export const insertSkills = async (skills: InsertSkills) => {
  return db.insert(schema.skills).values(skills);
};

// Insert Work Experience
export const insertExperience = async (experiences: InsertExperieces) => {
  return db.insert(schema.workExperiences).values(experiences);
};

// Insert Project
export const insertProject = async (projects: InsertProjects) => {
  return db.insert(schema.projects).values(projects);
};

// Insert Activity
export const insertActivity = async (activities: InsertActivities) => {
  return db.insert(schema.activities).values(activities);
};

// Insert Certification
export const insertCertification = async (
  certifications: InsertCertifications
) => {
  return db.insert(schema.certifications).values(certifications);
};

// Update User Email or Password
export const updateUser = async (
  userId: number,
  email?: string,
  passwordHash?: string
) => {
  return db
    .update(users)
    .set({
      email: email || undefined,
      passwordHash: passwordHash || undefined,
    })
    .where((users, { eq }) => eq(users.id, userId))
    .returning();
};

// Update Resume
export const updateResume = async (resumeId: number, isDraft?: boolean) => {
  return db
    .update(resumes)
    .set({
      isDraft: isDraft || undefined,
    })
    .where((resumes, { eq }) => eq(resumes.id, resumeId))
    .returning();
};

// Update Work Experience
export const updateWorkExperience = async (
  experienceId: number,
  company?: string,
  position?: string,
  from?: Date,
  to?: Date,
  description?: string
) => {
  return db
    .update(workExperiences)
    .set({
      company: company || undefined,
      position: position || undefined,
      from: from || undefined,
      to: to || undefined,
      description: description || undefined,
    })
    .where((workExperiences, { eq }) => eq(workExperiences.id, experienceId))
    .returning();
};

// Update Project
export const updateProject = async (
  projectId: number,
  name?: string,
  description?: string,
  companyName?: string,
  from?: Date,
  to?: Date
) => {
  return db
    .update(projects)
    .set({
      name: name || undefined,
      description: description || undefined,
      companyName: companyName || undefined,
      from: from || undefined,
      to: to || undefined,
    })
    .where((projects, { eq }) => eq(projects.id, projectId))
    .returning();
};

// Update Skills
export const updateSkills = async (
  skillId: number,
  category?: string,
  items?: string
) => {
  return db
    .update(skills)
    .set({
      category: category || undefined,
      items: items || undefined,
    })
    .where((skills, { eq }) => eq(skills.id, skillId))
    .returning();
};

// Update Activity
export const updateActivity = async (
  activityId: number,
  name?: string,
  role?: string,
  duration?: string,
  description?: string
) => {
  return db
    .update(activities)
    .set({
      name: name || undefined,
      role: role || undefined,
      duration: duration || undefined,
      description: description || undefined,
    })
    .where((activities, { eq }) => eq(activities.id, activityId))
    .returning();
};

// Update Education
export const updateEducation = async (
  educationId: number,
  school?: string,
  degree?: string,
  from?: Date,
  to?: Date
) => {
  return db
    .update(education)
    .set({
      school: school || undefined,
      degree: degree || undefined,
      from: from || undefined,
      to: to || undefined,
    })
    .where((education, { eq }) => eq(education.id, educationId))
    .returning();
};

// Update Certification
export const updateCertification = async (
  certificationId: number,
  title?: string,
  issuingOrganization?: string,
  from?: Date,
  to?: Date,
  credentialID?: string,
  credentialURL?: string
) => {
  return db
    .update(certifications)
    .set({
      title: title || undefined,
      issuingOrganization: issuingOrganization || undefined,
      from: from || undefined,
      to: to || undefined,
      credentialID: credentialID || undefined,
      credentialURL: credentialURL || undefined,
    })
    .where((certifications, { eq }) => eq(certifications.id, certificationId))
    .returning();
};

// Delete Work Experience
export const deleteWorkExperience = async (experienceId: number) => {
  return db
    .delete(workExperiences)
    .where((workExperiences, { eq }) => eq(workExperiences.id, experienceId))
    .returning();
};

// Delete Project
export const deleteProject = async (projectId: number) => {
  return db
    .delete(projects)
    .where((projects, { eq }) => eq(projects.id, projectId))
    .returning();
};

// Delete Skill
export const deleteSkill = async (skillId: number) => {
  return db
    .delete(skills)
    .where((skills, { eq }) => eq(skills.id, skillId))
    .returning();
};

// Delete Activity
export const deleteActivity = async (activityId: number) => {
  return db
    .delete(activities)
    .where((activities, { eq }) => eq(activities.id, activityId))
    .returning();
};

// Delete Education
export const deleteEducation = async (educationId: number) => {
  return db
    .delete(education)
    .where((education, { eq }) => eq(education.id, educationId))
    .returning();
};

// Delete Certification
export const deleteCertification = async (certificationId: number) => {
  return db
    .delete(certifications)
    .where((certifications, { eq }) => eq(certifications.id, certificationId))
    .returning();
};
