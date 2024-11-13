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
} from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { YearMonthSelector } from "../ui/year-month";
import { YearMonthSelectorOptional } from "../ui/year-month-optional";
import { useResumeStore } from "@/store/resume-store";

export const experienceSchema = z.object({
  experiences: z.array(
    z.object({
      company: z.string().min(1, { message: "Company is required." }),
      position: z.string().min(1, { message: "Position is required." }),
      from: z.date({
        required_error: "Please indicate the start of your work",
      }),
      to: z.date().optional(),
      description: z.string(),
    })
  ),
});

export default function ExperienceForm() {
  const form = useForm<z.infer<typeof experienceSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(experienceSchema),
  });

  const {
    fields: experienceFields,
    append: addExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  const updateExperienceInfo = useResumeStore((state) => state.updateExperienceInfo);

  const onSubmit = (data: z.infer<typeof experienceSchema>) => {
    updateExperienceInfo(data); // Update the store with the form data
    console.log("Submitted experience data:", data); // Log data for debugging
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {experienceFields.map((field, index) => (
              <Card key={field.id} className="p-6 bg-muted/50">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Experience {index + 1}
                    </h3>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
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
                      name={`experiences.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
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
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your role" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.from`}
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
                      name={`experiences.${index}.to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <YearMonthSelectorOptional
                            type="Currently Employed"
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
                    name={`experiences.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your responsibilities and achievements"
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
                addExperience({
                  company: "",
                  position: "",
                  from: new Date(),
                  to: undefined,
                  description: "",
                })
              }
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </CardContent>
        </Card>
        <Button type="submit">Save Experiences</Button>
      </form>
    </Form>
  );
}
