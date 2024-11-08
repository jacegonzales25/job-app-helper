import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  integer,
  boolean,
  date,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash"), // Nullable for OAuth users, for future password if scaling to email/password
    oauthProvider: text("oauth_provider"), // Google, Github, etc.
    oauthId: text("oauth_id"), // ID from the OAuth provider
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

export const oauthTokens = pgTable("oauth_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(), // Reference to the users table
  accessToken: text("access_token").notNull(), // Access token from OAuth provider
  refreshToken: text("refresh_token"), // Refresh token, nullable if not provided
  expiresAt: timestamp("expires_at"), // Expiration timestamp for access token
  createdAt: timestamp("created_at").defaultNow().notNull(), // When the token was created
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // When the token was last updated
});

export const oauthTokensRelations = relations(users, ({ many }) => ({
  oauthTokens: many(oauthTokens),
}));

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
  from: date("from").notNull(), // Changed to date
  to: date("to"), // Changed to date
  description: text("description"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id), // Link to resume
  name: text("name").notNull(),
  description: text("description").notNull(),
  companyName: text("company_name").default(""), // Optional field
  from: date("from").notNull(), // Changed to date
  to: date("to"), // Changed to date
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id),
  name: text("name"),
  role: text("role"),
  from: date("from").notNull(), // Changed to date
  to: date("to"), // Changed to date
  description: text("description"),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id), // Link to resume
  category: text("category").notNull(),
  items: jsonb("items"), // Could store skills as array
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id), // Link to resume
  school: text("school").notNull(),
  degree: text("degree").notNull(),
  from: date("from").notNull(), // Changed to date
  to: date("to").notNull(), // Changed to date
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id), // Link to resume
  title: text("title").notNull(),
  issuingOrganization: text("issuing_organization").notNull(),
  from: date("from").notNull(), // Changed to date
  to: date("to"), // Changed to date
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
