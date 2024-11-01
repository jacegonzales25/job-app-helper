"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useResumeStore } from "@/store/resume-store";

export const projectSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string().min(1, { message: "Project name is required." }),
      description: z.string().min(1, { message: "Description is required." }),
      from: z.date({
        required_error: "Please indicate the start of your work",
      }),
      to: z.date().optional(),
      companyName: z.string().optional(), // Optional field for freelance or employment-based projects
    })
  ),
});

export default function ProjectForm() {
  const store = useResumeStore();
  const transformedProjectsData = {
    projects: store.projectsInfo?.projects.map((project) => ({
      ...project,
      from: project.from instanceof Date ? project.from : new Date(project.from),
      to: project.to
        ? project.to instanceof Date
          ? project.to
          : new Date(project.to)
        : undefined,
    })),
  }
  const form = useForm<z.infer<typeof projectSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
    resolver: zodResolver(projectSchema),
    defaultValues: transformedProjectsData,
  });

  const {
    fields: projectFields,
    append: addProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  function onSubmit(values: z.infer<typeof projectSchema>) {
    store.updateProjectsInfo(values);
    console.log("Form Submitted: ", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projectFields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                {index > 0 && <Separator className="my-6" />}
                <FormField
                  control={form.control}
                  name={`projects.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Project Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`projects.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`projects.${index}.from`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>From</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "LLL yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date("2100-01-01") ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.to`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>To</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "LLL yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date("2100-01-01") ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`projects.${index}.companyName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Company Name (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {index > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Project
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={() =>
                addProject({
                  name: "",
                  description: "",
                  from: new Date(),
                  to: new Date() || undefined,
                  companyName: "",
                })
              }
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
