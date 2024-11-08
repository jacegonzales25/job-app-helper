"use server";

import { userSchema } from "./signup-form";

export async function signUp(values: typeof userSchema) {
  // 1. Validate Fields

  const validationResult = userSchema.safeParse(values);
  if (!validationResult.success) {
    // 400 Bad Request
    return {
      status: 400,
      error: validationResult.error.issues,
    };
  }

  // 2. Create User (send confirmation email if scaling)
  // 3. Create session
}
