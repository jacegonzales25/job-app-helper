import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(), // User's email for login
    passwordHash: text("password_hash").notNull(), // Encrypted password for login
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  isDraft: boolean("isDraft").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const personalInfo = pgTable("personal_info", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id), // Link to resume
  fullName: text("full_name").notNull(),
  location: text("location").notNull(),
  email: text("email").notNull(),
  contactNumber: text("contact_number"),
  github: text("github").default(""),
  linkedIn: text("linkedin").default(""),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const workExperiences = pgTable("work_experiences", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id), // Link to resume
  company: text("company").notNull(),
  position: text("position").notNull(),
  from: timestamp("from").notNull(), // Start date of work experience
  to: timestamp("to").default(new Date()), // End date, optional
  description: text("description"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id), // Link to resume
  name: text("name").notNull(),
  description: text("description").notNull(),
  companyName: text("company_name").default(""), // Optional field
  from: timestamp("from").notNull(), // Start date of the project
  to: timestamp("to").default(new Date()), // End date, optional
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id),
  name: text("name"),
  role: text("role"),
  from: timestamp("from").notNull(), // Start date of the project
  to: timestamp("to").default(new Date()), // End date, optional
  description: text("description"),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id), // Link to resume
  category: text("category").notNull(),
  items: text("items").notNull(), // Could store skills as comma-separated or serialized JSON string
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id), // Link to resume
  school: text("school").notNull(),
  degree: text("degree").notNull(),
  from: timestamp("from").notNull(), // Start of education
  to: timestamp("to").notNull(), // Graduation date
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id), // Link to resume
  title: text("title").notNull(),
  issuingOrganization: text("issuing_organization").notNull(),
  from: timestamp("from").notNull(), // Issue date
  to: timestamp("to").default(new Date()), // Optional expiry date
  credentialID: text("credential_id").default(""), // Optional credential ID
  credentialURL: text("credential_url").default(""), // Optional credential URL
});

// Photos for future AI generation

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const photosRelations = relations(users, ({ many }) => ({
  photos: many(photos),
}));

export const resumesRelations = relations(users, ({ one }) => ({
  resume: one(resumes),
}));

// Resume fields
