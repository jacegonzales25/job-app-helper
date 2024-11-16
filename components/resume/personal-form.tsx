"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/store/resume-store";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, { message: "Name is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  contactNumber: z.string().min(1, { message: "Number is required" }),
  github: z.string().url({ message: "Invalid URL" }).or(z.literal("")),
  linkedIn: z.string().url({ message: "Invalid URL" }).or(z.literal("")),
});

export default function PersonalForm() {
  const { toast } = useToast();
  const personalInfoData = useResumeStore((state) => state.personalInfo);
  const transformedData = {
    ...personalInfoData,
  };

  const form = useForm<z.infer<typeof personalInfoSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
    resolver: zodResolver(personalInfoSchema),
    defaultValues: transformedData,
  });

  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo
  );

  function onSubmit(data: z.infer<typeof personalInfoSchema>) {
    toast({
      title: "Personal Information Updated",
      description: "Your personal information has been updated successfully.",
    });
    updatePersonalInfo(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your contact number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your GitHub profile URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your LinkedIn profile URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Save Information</Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
