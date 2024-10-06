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
    email: text("email").notNull().unique(),
    fullName: text("full_name"),
    location: text("location"),
    contactNumber: text("contact_number"),
    githubLink: text("github_link"),
    linkedIn: text("linkedin"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
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
  content: text("content"),
  isDraft: boolean("isDraft").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const workExperiences = pgTable("work_experiences", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id),
  company: text("company"),
  position: text("position"),
  duration: text("duration"),
  description: text("description"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id),
  name: text("name"),
  description: text("description"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id),
  name: text("name"),
  role: text("role"),
  duration: text("duration"),
  description: text("description"),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => resumes.id),
  category: text("category"),
  items: text("items"),
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
