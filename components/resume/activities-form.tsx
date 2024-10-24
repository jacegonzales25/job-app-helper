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
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  useActivitiesInfo,
  useResumeActions,
} from "@/store/providers/resume-store-provider";

export const activitiesSchema = z.object({
  activities: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Activity name is required." }),
        role: z.string().min(1, { message: "Role is required." }),
        duration: z.object({
          from: z.date({
            required_error: "Please indicate the start of your work",
          }),
          to: z.date().optional(),
        }),
        description: z.string(),
      })
    )
    .optional(),
});

export default function ActivitiesForm() {
  const activitiesData = useActivitiesInfo();
  const { updateActivitiesInfo } = useResumeActions();
  const form = useForm<z.infer<typeof activitiesSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
    resolver: zodResolver(activitiesSchema),
    defaultValues: {
      activities: activitiesData?.activities || [],
    },
  });

  const {
    fields: activityFields,
    append: addActivity,
    remove: removeActivity,
  } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  function onSubmit(values: z.infer<typeof activitiesSchema>) {
    updateActivitiesInfo(values);
    console.log("Form Submitted: ", values);
  }

  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Leadership Experience & Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {activityFields.map((field, index) => (
            <div key={field.id} className="space-y-4">
              {index > 0 && <Separator className="my-6" />}
              <FormField
                control={form.control}
                name={`activities.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Activity Name" {...field} />
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
                    <FormControl>
                      <Input placeholder="Role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`activities.${index}.duration.from`}
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
                  name={`activities.${index}.duration.to`}
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
                name={`activities.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {index > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeActivity(index)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Activity
                </Button>
              )}
            </div>
          ))}
          <Button
            onClick={() =>
              addActivity({
                name: "",
                role: "",
                duration: {
                  from: new Date(),
                  to: new Date(),
                },
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
  </Form>;
}
