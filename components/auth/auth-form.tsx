"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EyeIcon, EyeOffIcon, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const authSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Handle submission for sign-in and sign-up
  async function onSubmit(
    values: z.infer<typeof authSchema>,
    action: "signin" | "signup"
  ) {
    setError(null);
    try {
      const response = await fetch(`/api/auth/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.redirectUrl) {
          router.push(data.redirectUrl); // Redirect to dashboard
        }
      } else {
        const data = await response.json();
        if (data.error && Array.isArray(data.error)) {
          data.error.forEach((issue: any) => {
            form.setError(issue.path[0] as "email" | "password", {
              type: "server",
              message: issue.message,
            });
          });
        } else {
          setError(data.error || `An error occurred during ${action}`);
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setError("An unexpected error occurred");
    }
  }
  
  // Handle OAuth redirection for Google and GitHub
  const handleOAuthRedirect = async (provider: "google" | "github") => {
    try {
      const response = await fetch(`/api/auth/oauth/${provider}`);
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url; // Redirect to OAuth URL
      } else {
        setError(`Failed to initiate ${provider} OAuth`);
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          {/* Sign In Form */}
          <TabsContent value="signin">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) =>
                  onSubmit(values, "signin")
                )}
                className="space-y-4"
              >
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Hide password"
                                  : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthRedirect("google")}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        {/* Google SVG */}
                        <path fill="currentColor" d="..." />
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthRedirect("github")}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>
          {/* Sign Up Form */}
          <TabsContent value="signup">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) =>
                  onSubmit(values, "signup")
                )}
                className="space-y-4"
              >
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Enter your details to create your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Hide password"
                                  : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthRedirect("google")}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        {/* Google SVG */}
                        <path fill="currentColor" d="..." />
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthRedirect("github")}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
