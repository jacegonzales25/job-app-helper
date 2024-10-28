import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

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
type InsertExperiences = typeof schema.workExperiences.$inferInsert;
type InsertProjects = typeof schema.projects.$inferInsert;
type InsertEducation = typeof schema.education.$inferInsert;
type InsertActivities = typeof schema.activities.$inferInsert;
type InsertCertifications = typeof schema.certifications.$inferInsert;

export async function findOrCreateOAuthUser(email: string, provider: string, oauthId: string) {
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email) && eq(users.oauthProvider, provider) && eq(users.oauthId, oauthId),
  });

  if (existingUser) {
    return existingUser; // User already exists, return the user
  }

  // Otherwise, create a new user
  const newUser = await db.insert(schema.users).values({
    email,
    oauthProvider: provider,
    oauthId,
    createdAt: new Date(),
  });

  return newUser;
}

// Insert User
export const insertUser = async (user: InsertUser) => {
  return db.insert(schema.users).values(user);
};

// Insert Resume
export const insertResume = async (resume: InsertResume) => {
  return db.insert(schema.resumes).values(resume).returning();
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
export const insertExperience = async (experiences: InsertExperiences) => {
  return db.insert(schema.workExperiences).values(experiences);
};

// Insert Project
export const insertProject = async (projects: InsertProjects) => {
  return db.insert(schema.projects).values(projects);
};

export const insertEducation = async (education: InsertEducation) => {
  return db.insert(schema.education).values(education);
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
export const updateUser = async (user: InsertUser) => {
  return db
    .update(schema.users)
    .set({
      passwordHash: user.passwordHash ?? undefined,
      email: user.email ?? undefined, // Optional email update
    })
    .where(eq(schema.users.id, user.id!)) // Assuming user id is required for updates
    .returning();
};

// Update Resume
export const updateResume = async (resume: InsertResume) => {
  return db
    .update(schema.resumes)
    .set({
      isDraft: resume.isDraft ?? undefined,
    })
    .where(eq(schema.resumes.id, resume.id!)) // Assuming id is required for updates
    .returning();
};

// Update Personal Info
export const updatePersonalInfo = async (personalInfo: InsertPersonalInfo) => {
  return db
    .update(schema.personalInfo)
    .set({
      fullName: personalInfo.fullName ?? undefined,
      location: personalInfo.location ?? undefined,
      email: personalInfo.email ?? undefined,
      contactNumber: personalInfo.contactNumber ?? undefined,
      github: personalInfo.github ?? undefined,
      linkedIn: personalInfo.linkedIn ?? undefined,
    })
    .where(eq(schema.personalInfo.id, personalInfo.id!))
    .returning(); // Assuming id is required for updates
};
// Update Work Experience
export const updateWorkExperience = async (experience: InsertExperiences) => {
  return db
    .update(schema.workExperiences)
    .set({
      company: experience.company ?? undefined,
      position: experience.position ?? undefined,
      from: experience.from ?? undefined,
      to: experience.to ?? undefined,
      description: experience.description ?? undefined,
    })
    .where(eq(schema.workExperiences.id, experience.id!)) // Assuming id is required for updates
    .returning();
};

export const updateSkills = async (skills: InsertSkills) => {
  return db
    .update(schema.skills)
    .set({
      category: skills.category ?? undefined,
      items: skills.items ?? undefined,
    })
    .where(eq(schema.skills.id, skills.id!)) // Assuming id is required for updates
    .returning();
};

// Update Project
export const updateProject = async (project: InsertProjects) => {
  return db
    .update(schema.projects)
    .set({
      name: project.name ?? undefined,
      description: project.description ?? undefined,
      companyName: project.companyName ?? undefined,
      from: project.from ?? undefined,
      to: project.to ?? undefined,
    })
    .where(eq(schema.projects.id, project.id!)) // Assuming id is required for updates
    .returning();
};

// Update Activity
export const updateActivity = async (activity: InsertActivities) => {
  return db
    .update(schema.activities)
    .set({
      name: activity.name ?? undefined,
      role: activity.role ?? undefined,
      from: activity.from ?? undefined,
      to: activity.to ?? undefined,
      description: activity.description ?? undefined,
    })
    .where(eq(schema.activities.id, activity.id!)) // Assuming id is required for updates
    .returning();
};

// Update Education
export const updateEducation = async (education: InsertEducation) => {
  return db
    .update(schema.education)
    .set({
      school: education.school ?? undefined,
      degree: education.degree ?? undefined,
      from: education.from ?? undefined,
      to: education.to ?? undefined,
    })
    .where(eq(schema.education.id, education.id!)) // Assuming id is required for updates
    .returning();
};

// Update Certification
export const updateCertification = async (
  certification: InsertCertifications
) => {
  return db
    .update(schema.certifications)
    .set({
      title: certification.title ?? undefined,
      issuingOrganization: certification.issuingOrganization ?? undefined,
      from: certification.from ?? undefined,
      to: certification.to ?? undefined,
      credentialID: certification.credentialID ?? undefined,
      credentialURL: certification.credentialURL ?? undefined,
    })
    .where(eq(schema.certifications.id, certification.id!)) // Assuming id is required for updates
    .returning();
};

// Delete Resume
export const deleteResume = async (resumeId: number) => {
  return db
    .delete(schema.resumes)
    .where(eq(schema.resumes.id, resumeId))
    .returning(); // Return deleted resume data if needed
};

// Delete Work Experience
export const deleteWorkExperience = async (experienceId: number) => {
  return db
    .delete(schema.workExperiences)
    .where(eq(schema.workExperiences.id, experienceId))
    .returning(); // Return deleted work experience data if needed
};

// Delete Project
export const deleteProject = async (projectId: number) => {
  return db
    .delete(schema.projects)
    .where(eq(schema.projects.id, projectId))
    .returning(); // Return deleted project data if needed
};

// Delete Skill
export const deleteSkill = async (skillId: number) => {
  return db
    .delete(schema.skills)
    .where(eq(schema.skills.id, skillId))
    .returning(); // Return deleted skill data if needed
};

// Delete Activity
export const deleteActivity = async (activityId: number) => {
  return db
    .delete(schema.activities)
    .where(eq(schema.activities.id, activityId))
    .returning(); // Return deleted activity data if needed
};

// Delete Education
export const deleteEducation = async (educationId: number) => {
  return db
    .delete(schema.education)
    .where(eq(schema.education.id, educationId))
    .returning(); // Return deleted education data if needed
};

// Delete Certification
export const deleteCertification = async (certificationId: number) => {
  return db
    .delete(schema.certifications)
    .where(eq(schema.certifications.id, certificationId))
    .returning(); // Return deleted certification data if needed
};
