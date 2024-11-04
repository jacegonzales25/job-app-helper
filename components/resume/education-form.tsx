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
import { Button } from "../ui/button";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useResumeStore } from "@/store/resume-store";
import { YearMonthSelector } from "../ui/year-month";

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
  const store = useResumeStore();

  const transformedEducationData = {
    education:
      store.educationInfo?.education.map((edu) => ({
        ...edu,
        from: edu.from instanceof Date ? edu.from : new Date(edu.from),
        to: edu.to instanceof Date ? edu.to : new Date(edu.to),
      })) || [],
  };

  const form = useForm<z.infer<typeof educationSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
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

  function onSubmit(values: z.infer<typeof educationSchema>) {
    store.updateEducationInfo(values);
    console.log("Form Submitted: ", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {educationFields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                {index > 0 && <Separator className="my-6" />}
                <FormField
                  control={form.control}
                  name={`education.${index}.school`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="School Name" {...field} />
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
                      <FormControl>
                        <Input placeholder="Degree" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.from`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
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
                      <FormItem className="flex flex-col">
                        <FormLabel>To</FormLabel>
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

                {index > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Education
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={() =>
                addEducation({
                  school: "",
                  degree: "",
                  from: new Date(),
                  to: new Date(),
                })
              }
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
