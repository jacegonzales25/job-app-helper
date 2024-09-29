import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  integer,
  boolean
} from 'drizzle-orm/pg-core';


export const usersTable = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        email: text('email').notNull().unique(),
        createdAt: timestamp('createdAt').defaultNow().notNull(),
    }, (users) => {
        return {
            uniqueIdx: uniqueIndex('unique_idx').on(users.email)
        }
    }
)

export const photosTable = pgTable(
    'photos',
    {
        id: serial('id').primaryKey(),
        userId: integer("user_id"),
        url: text('url').notNull(),
        createdAt: timestamp('createdAt').defaultNow().notNull(),
    }
)

export const resumesTable = pgTable(
    'resumes',
    {
        id: serial('id').primaryKey(),
        userId: integer("user_id"),
        content: text('content'),
        isDraft: boolean('isDraft').default(false),
        createdAt: timestamp('createdAt').defaultNow().notNull(),
    }
)