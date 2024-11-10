"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignUpForm() {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function signUp(values: z.infer<typeof userSchema>) {
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // If sign-up was successful, redirect to dashboard
        router.push("/dashboard");
      } else {
        const data = await response.json();
        // Handle validation errors from the server
        if (data.error && Array.isArray(data.error)) {
          data.error.forEach((issue: any) => {
            form.setError(issue.path[0], {
              type: "server",
              message: issue.message,
            });
          });
        } else {
          setError(data.error || "An error occurred");
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setError("An unexpected error occurred");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(signUp)} className="space-y-4">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting} // Disable when submitting
        >
          {form.formState.isSubmitting ? "Submitting..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
