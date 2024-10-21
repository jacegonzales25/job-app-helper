"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

const personalInfoSchema = z.object({
  fullName: z.string().min(1, { message: "Name is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  contactNumber: z.string(),
  github: z.string().url().optional(),
  linkedIn: z.string().url().optional(),
});

export default function PersonalForm() {
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
    resolver: zodResolver(personalInfoSchema),
  });

  function onSubmit(values: z.infer<typeof personalInfoSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"location"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"email"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"contactNumber"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Contact Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"github"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Github Link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"linkedIn"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="LinkedIn Link" {...field} />
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
