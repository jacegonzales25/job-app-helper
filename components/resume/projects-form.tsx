"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
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
import { PlusCircle, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { YearMonthSelector } from "@/components/ui/year-month";
import { YearMonthSelectorOptional } from "@/components/ui/year-month-optional";
import { useResumeStore } from "@/store/resume-store";
import { useToast } from "@/hooks/use-toast";

export const projectSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string().min(1, { message: "Project name is required." }),
      description: z.string().min(1, { message: "Description is required." }),
      from: z.date({
        required_error: "Please indicate the start date of your project",
      }),
      to: z.date().optional(),
      companyName: z.string().optional(),
    })
  ),
});

export default function ProjectForm() {
  const { toast } = useToast();
  const projectsInfo = useResumeStore((state) => state.projectsInfo);

  const form = useForm<z.infer<typeof projectSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(projectSchema),
    defaultValues: projectsInfo ?? { projects: [] },
  });

  const {
    fields: projectFields,
    append: addProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const updateProjectsInfo = useResumeStore(
    (state) => state.updateProjectsInfo
  );

  function onSubmit(data: z.infer<typeof projectSchema>) {
    toast({
      title: "Personal Projects Updated",
      description: "Your personal projects has been updated successfully.",
    });
    updateProjectsInfo(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projectFields.map((field, index) => (
              <Card key={field.id} className="p-6 bg-muted/50">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Project {index + 1}
                    </h3>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter project name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.companyName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter company name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.from`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <YearMonthSelector
                            year={
                              field.value?.getFullYear() ||
                              new Date().getFullYear()
                            }
                            month={(field.value?.getMonth() || 0) + 1}
                            onYearChange={(year) => {
                              const newDate = new Date(
                                year,
                                field.value?.getMonth() || 0
                              );
                              field.onChange(newDate);
                            }}
                            onMonthChange={(month) => {
                              const newDate = new Date(
                                field.value?.getFullYear() ||
                                  new Date().getFullYear(),
                                month - 1
                              );
                              field.onChange(newDate);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <YearMonthSelectorOptional
                            type="Ongoing"
                            year={
                              field.value?.getFullYear() ||
                              new Date().getFullYear()
                            }
                            month={(field.value?.getMonth() || 0) + 1}
                            onYearChange={(year) => {
                              const newDate = new Date(
                                year,
                                field.value?.getMonth() || 0
                              );
                              field.onChange(newDate);
                            }}
                            onMonthChange={(month) => {
                              const newDate = new Date(
                                field.value?.getFullYear() ||
                                  new Date().getFullYear(),
                                month - 1
                              );
                              field.onChange(newDate);
                            }}
                            isCurrentlyEmployed={!field.value}
                            onCurrentlyEmployedChange={(checked) => {
                              field.onChange(checked ? undefined : new Date());
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your project and its key features"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                addProject({
                  name: "",
                  description: "",
                  from: new Date(),
                  to: undefined,
                  companyName: "",
                })
              }
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Project
            </Button>
            <Button type="submit">Save Projects</Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
