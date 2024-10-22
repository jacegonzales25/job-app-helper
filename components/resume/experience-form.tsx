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
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";

const experienceSchema = z.object({
  experiences: z.array(
    z.object({
      company: z.string().min(1, { message: "Company is required." }),
      position: z.string().min(1, { message: "Position is required." }),
      duration: z.object({
        from: z.date({
          required_error: "Please indicate the start of your work",
        }),
        to: z.date().optional(),
      }),
      description: z.string(),
    })
  ),
});

export default function ExperienceForm() {
  const form = useForm<z.infer<typeof experienceSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
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

  function onSubmit(values: z.infer<typeof experienceSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardContent className="space-y-6">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  {index > 0 && <Separator className="my-6" />}
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Company" {...field} />
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
                        <FormControl>
                          <Input placeholder="Position/Role" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.duration.from`}
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                      name={`experiences.${index}.duration.to`}
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                    name={`experiences.${index}.description`}
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
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Experience
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={() =>
                  addExperience({
                    company: "",
                    position: "",
                    duration: {
                      to: new Date(),
                      from: new Date(),
                    },
                    description: "",
                  })
                }
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </CardHeader>
        </Card>
      </form>
    </Form>
  );
}
