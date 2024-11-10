import { db } from "./db";
import { users } from "./schema";
import { cache } from "react";
import { verifySession } from "@/lib/session";

// Define the User type
type User = typeof users.$inferSelect & {
  sessions?: { sessionToken: string; expiresAt: Date }[];
};

// Define the UserDTO type
interface UserDTO {
  id: number;
  email: string;
  createdAt: Date;
  session: string;
}

// User Data Transfer Object function
function userDTO(user: User): UserDTO {
  const latestSession = user.sessions?.[0]?.sessionToken || "No active session";
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    session: latestSession,
  };
}

// Wrap your data-fetching function with cache
export const getUserById = cache(
  async (userId: number): Promise<UserDTO | null> => {
    // 1. Verify session
    const session = await verifySession();
    if (!session || session.userId !== userId) {
      throw new Error("Unauthorized");
    }

    try {
      // 2. Fetch user from database
      const user = await db.query.users.findFirst({
        where: (usersTable, { eq }) => eq(usersTable.id, userId),
        with: {
          sessions: true, // Adjust based on Drizzle ORM's join syntax
        },
      });

      // 3. Check if user exists before calling userDTO
      if (user) {
        return userDTO(user);
      } else {
        return null; // User not found
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  }
);
