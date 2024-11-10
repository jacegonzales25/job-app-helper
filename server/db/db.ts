import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";
import { eq, lt } from "drizzle-orm";

export const db = drizzle(sql, { schema });

// Fetch all users
export const getUsers = async () => {
  try {
    return db.query.users.findMany();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
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

// if using multiple resume in the future
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
type User = typeof schema.users.$inferSelect;
type InsertSession = typeof schema.sessions.$inferInsert;

export async function findOrCreateOAuthUser(
  email: string,
  provider: string,
  oauthId: string,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: Date // Optionally store token expiration time
): Promise<User> {
  try {
    // Check if the user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(
          eq(users.email, email),
          eq(users.oauthProvider, provider),
          eq(users.oauthId, oauthId)
        ),
    });

    let user: User;

    if (existingUser) {
      user = existingUser;
    } else {
      // If user doesn't exist, create a new user
      const insertedUsers = await db
        .insert(schema.users)
        .values({
          email,
          oauthProvider: provider,
          oauthId,
          createdAt: new Date(),
        })
        .returning(); // Ensure that you use .returning() to get the inserted rows

      if (insertedUsers.length === 0) {
        throw new Error("Failed to insert new user");
      }

      user = insertedUsers[0];
    }

    // Store the OAuth tokens for the user in the oauthTokens table
    const existingToken = await db.query.oauthTokens.findFirst({
      where: (tokens, { eq }) => eq(tokens.userId, user.id),
    });

    if (existingToken) {
      // Update existing token if any changes are detected
      await db
        .update(schema.oauthTokens)
        .set({
          accessToken,
          refreshToken,
          expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(schema.oauthTokens.userId, user.id));
    } else {
      // Insert new token for the user
      await db.insert(schema.oauthTokens).values({
        userId: user.id,
        accessToken,
        refreshToken,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return user;
  } catch (error) {
    console.error("Error during OAuth user creation or token storage:", error);
    throw new Error("Failed to create or find OAuth user and store tokens");
  }
}

// Fetch the OAuth token for the user
export const getOAuthTokenForUser = async (userId: string) => {
  const userIdAsNumber = Number(userId); // Convert string to number
  if (isNaN(userIdAsNumber)) {
    throw new Error("Invalid userId");
  }

  const oauthToken = await db.query.oauthTokens.findFirst({
    where: (tokens, { eq }) => eq(tokens.userId, userIdAsNumber),
  });

  if (!oauthToken) {
    throw new Error("OAuth token not found for user");
  }

  return oauthToken;
};

// Insert User
export const insertUser = async (user: InsertUser) => {
  try {
    const [insertedUser] = await db
      .insert(schema.users)
      .values(user)
      .returning(); // This returns the inserted user with the generated id
    return insertedUser;
  } catch (error) {
    console.error("Error inserting user:", error);
    throw new Error("Failed to insert user");
  }
};

// Insert Resume
export const insertResume = async (resume: InsertResume) => {
  try {
    return db.insert(schema.resumes).values(resume).returning();
  } catch (error) {
    console.error("Error inserting resume:", error);
    throw new Error("Failed to insert resume");
  }
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

// Update Skills
export const updateSkills = async (skills: InsertSkills) => {
  return db
    .update(schema.skills)
    .set({
      category: skills.category ?? undefined,
      items: skills.items ?? undefined, // Directly handle items as an array
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

// Session management
// Insert Session
export const insertSession = async (sessionData: InsertSession) => {
  try {
    await db.insert(schema.sessions).values(sessionData);
  } catch (error) {
    console.error("Error inserting session:", error);
    throw new Error("Failed to insert session");
  }
};

// Clean up expired sessions (optional)
export const cleanUpExpiredSessions = async () => {
  try {
    await db
      .delete(schema.sessions)
      .where(lt(schema.sessions.expiresAt, new Date()));
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
    throw new Error("Failed to clean up sessions");
  }
};
