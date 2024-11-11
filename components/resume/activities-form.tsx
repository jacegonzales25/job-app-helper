"use client";

import { useEffect } from "react";
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
import { useResumeStore } from "@/store/resume-store";
import { YearMonthSelector } from "@/components/ui/year-month";
import { YearMonthSelectorOptional } from "@/components/ui/year-month-optional";

// Define the schema for activities
export const activitiesSchema = z.object({
  activities: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Activity name is required." }),
        role: z.string().min(1, { message: "Role is required." }),
        from: z.date({
          required_error: "Please indicate the start date of your activity",
        }),
        to: z.date().optional(),
        description: z.string(),
      })
    )
    .optional(),
});

export default function ActivitiesForm() {
  const { activitiesInfo, updateActivitiesInfo } = useResumeStore((state) => ({
    activitiesInfo: state.activitiesInfo,
    updateActivitiesInfo: state.updateActivitiesInfo,
  }));

  // Transform existing activities to ensure date format
  const transformedActivitiesData = {
    activities:
      activitiesInfo?.activities?.map((activity) => ({
        ...activity,
        from:
          activity.from instanceof Date
            ? activity.from
            : new Date(activity.from),
        to: activity.to
          ? activity.to instanceof Date
            ? activity.to
            : new Date(activity.to)
          : undefined,
      })) || [],
  };

  // Set up form handling with React Hook Form
  const form = useForm<z.infer<typeof activitiesSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(activitiesSchema),
    defaultValues: transformedActivitiesData,
  });

  const {
    fields: activityFields,
    append: addActivity,
    remove: removeActivity,
  } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  // Sync form changes to Zustand store
  useEffect(() => {
    const subscription = form.watch((values) => {
      const filledValues = {
        activities:
          values.activities?.map((activity) => ({
            name: activity?.name || "",
            role: activity?.role || "",
            from:
              activity?.from instanceof Date
                ? activity.from
                : new Date(activity?.from || Date.now()),
            to: activity?.to instanceof Date ? activity.to : undefined,
            description: activity?.description || "",
          })) || [], // Ensure activities is always an array
      };
      updateActivitiesInfo(filledValues);
    });
    return () => subscription.unsubscribe();
  }, [form, updateActivitiesInfo]);

  function onSubmit(values: z.infer<typeof activitiesSchema>) {
    updateActivitiesInfo(values); // Updates Zustand store with form data
    console.log("Form Submitted: ", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Leadership Experience & Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activityFields.map((field, index) => (
              <Card key={field.id} className="p-6 bg-muted/50">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Activity {index + 1}
                    </h3>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivity(index)}
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
                      name={`activities.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter activity name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`activities.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
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
                      name={`activities.${index}.from`}
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
                      name={`activities.${index}.to`}
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
                    name={`activities.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your role and achievements in this activity"
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
                addActivity({
                  name: "",
                  role: "",
                  from: new Date(),
                  to: undefined,
                  description: "",
                })
              }
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
