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
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/resume-store";

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, { message: "Name is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  contactNumber: z.string().min(1, { message: "Number is required" }),
  github: z.string().url().optional(),
  linkedIn: z.string().url().optional(),
});

export default function PersonalForm() {
  const store = useResumeStore();
  const personalInfoData = store.personalInfo;
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: personalInfoData?.fullName || "",
      location: personalInfoData?.location || "",
      email: personalInfoData?.email || "",
      contactNumber: personalInfoData?.contactNumber || "",
      github: personalInfoData?.github || "",
      linkedIn: personalInfoData?.linkedIn || "",
    },
  });

  function onSubmit(values: z.infer<typeof personalInfoSchema>) {
    store.updatePersonalInfo(values);
    console.log("Form Submitted: ", values);
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
