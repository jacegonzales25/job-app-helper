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

export const certificationsSchema = z.object({
  certifications: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, { message: "Certification title is required." }),
        issuingOrganization: z.string().min(1, {
          message: "Issuing organization is required.",
        }),
        from: z.date({
          required_error: "Please indicate the start of your work",
        }),
        to: z.date().optional(),
        credentialID: z.string().optional(),
        credentialURL: z.string().url().optional(),
      })
    )
    .optional(),
});

export default function CertificationsForm() {
  const store = useResumeStore();
  const certificationsData = store.certificationsInfo;
  const form = useForm<z.infer<typeof certificationsSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
    resolver: zodResolver(certificationsSchema),
    defaultValues: {
      certifications: certificationsData?.certifications || [],
    },
  });

  const {
    fields: certificationFields,
    append: addCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  function onSubmit(values: z.infer<typeof certificationsSchema>) {
    store.updateCertificationsInfo(values);
    console.log("Form Submitted: ", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {certificationFields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                {index > 0 && <Separator className="my-6" />}
                <FormField
                  control={form.control}
                  name={`certifications.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Certification Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`certifications.${index}.issuingOrganization`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Issuing Organization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`certifications.${index}.from`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Issue Date</FormLabel>
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
                    name={`certifications.${index}.to`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date (Optional)</FormLabel>
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
                  name={`certifications.${index}.credentialID`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Credential ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`certifications.${index}.credentialURL`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Credential URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {index > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCertification(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Activity
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={() =>
                addCertification({
                  title: "",
                  issuingOrganization: "",
                  from: new Date(),
                  to: new Date() || undefined,
                  credentialID: "",
                  credentialURL: "",
                })
              }
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
