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
import { YearMonthSelector } from "@/components/ui/year-month";
import { YearMonthSelectorOptional } from "@/components/ui/year-month-optional";
import { useResumeStore } from "@/store/resume-store";

export const certificationsSchema = z.object({
  certifications: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, { message: "Certification title is required." }),
        issuingOrganization: z
          .string()
          .min(1, { message: "Issuing organization is required." }),
        from: z.date({ required_error: "Please indicate the issue date" }),
        to: z.date().optional(),
        credentialID: z.string().optional(),
        credentialURL: z.string().url().optional(),
      })
    )
    .optional(),
});

export default function CertificationsForm() {
  const form = useForm<z.infer<typeof certificationsSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
    resolver: zodResolver(certificationsSchema),
  });

  const {
    fields: certificationFields,
    append: addCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const updateCertificationsInfo = useResumeStore(
    (state) => state.updateCertificationsInfo
  );

  function onSubmit(data: z.infer<typeof certificationsSchema>) {
    updateCertificationsInfo(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {certificationFields.map((field, index) => (
              <Card key={field.id} className="p-6 bg-muted/50">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Certification {index + 1}
                    </h3>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(index)}
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
                      name={`certifications.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certification Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter certification title"
                              {...field}
                            />
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
                          <FormLabel>Issuing Organization</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter issuing organization"
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
                      name={`certifications.${index}.from`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Date</FormLabel>
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
                      name={`certifications.${index}.to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date (Optional)</FormLabel>
                          <YearMonthSelectorOptional
                            type="No Expiry"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`certifications.${index}.credentialID`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credential ID (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter credential ID"
                              {...field}
                            />
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
                          <FormLabel>Credential URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter credential URL"
                              {...field}
                            />
                          </FormControl>
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
              variant="outline"
              className="w-full"
              onClick={() =>
                addCertification({
                  title: "",
                  issuingOrganization: "",
                  from: new Date(),
                  to: undefined,
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
