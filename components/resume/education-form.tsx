"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { PlusCircle, Trash2 } from "lucide-react";
import { useResumeStore } from "@/store/resume-store";
import { YearMonthSelector } from "@/components/ui/year-month";

export const educationSchema = z.object({
  education: z.array(
    z.object({
      school: z.string().min(1, { message: "School is required." }),
      degree: z.string().min(1, { message: "Degree is required." }),
      from: z.date({
        required_error: "Please indicate the start of your education",
      }),
      to: z.date({ required_error: "Please indicate the graduation date" }),
    })
  ),
});

export default function EducationForm() {
  const { educationInfo, updateEducationInfo } = useResumeStore((state) => ({
    educationInfo: state.educationInfo,
    updateEducationInfo: state.updateEducationInfo,
  }));

  const transformedEducationData = {
    education:
      educationInfo?.education?.map((edu) => ({
        ...edu,
        from: edu.from instanceof Date ? edu.from : new Date(edu.from),
        to: edu.to instanceof Date ? edu.to : new Date(edu.to),
      })) || [],
  };

  const form = useForm<z.infer<typeof educationSchema>>({
    mode: "onChange",
    resolver: zodResolver(educationSchema),
    defaultValues: transformedEducationData,
  });

  const {
    fields: educationFields,
    append: addEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  // Update Zustand store when form data changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      const filledValues = {
        education:
          values.education?.map((edu) => ({
            school: edu?.school || "",
            degree: edu?.degree || "",
            from:
              edu?.from instanceof Date
                ? edu.from
                : new Date(edu?.from || Date.now()),
            to:
              edu?.to instanceof Date
                ? edu.to
                : new Date(edu?.to || Date.now()),
          })) || [], // Ensure education is always an array
      };
      updateEducationInfo(filledValues);
    });
    return () => subscription.unsubscribe();
  }, [form, updateEducationInfo]);

  function onSubmit(values: z.infer<typeof educationSchema>) {
    updateEducationInfo(values);
    console.log("Form Submitted: ", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-md">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-2xl font-bold">Education</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {educationFields.map((field, index) => (
              <Card
                key={field.id}
                className="p-4 bg-background border-2 border-muted"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Education {index + 1}
                    </h3>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`education.${index}.school`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter school name"
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter degree"
                              {...field}
                              className="bg-background"
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
                      name={`education.${index}.from`}
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
                      name={`education.${index}.to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            To{" "}
                            <span className="text-sm text-muted-foreground">
                              or Expected Graduation
                            </span>
                          </FormLabel>
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
                  </div>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              onClick={() =>
                addEducation({
                  school: "",
                  degree: "",
                  from: new Date(),
                  to: new Date(),
                })
              }
              variant="outline"
              className="w-full"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
