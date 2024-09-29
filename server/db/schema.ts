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
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content"),
  isDraft: boolean("isDraft").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const photosRelations = relations(users, ({ many }) => ({
  photos: many(photos),
}));

export const resumesRelations = relations(users, ({ one }) => ({
  resume: one(resumes),
}));
