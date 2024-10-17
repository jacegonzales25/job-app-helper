"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
} from "../ui/form";

// Define Zod schema for validation
const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2, { message: "Name is required." }),
    location: z.string().min(2, { message: "Location is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    contactNumber: z.string(),
    github: z.string().url().optional(),
    linkedIn: z.string().url().optional(),
  }),
  skills: z.array(
    z.object({
      category: z.string().min(1, { message: "Category is required." }),
      items: z.string().min(1, { message: "At least one skill is required." }),
    })
  ),
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
  projects: z.array(
    z.object({
      name: z.string().min(1, { message: "Project name is required." }),
      description: z.string().min(1, { message: "Description is required." }),
      duration: z.object({
        from: z.date({
          required_error: "Please indicate the start of your work",
        }),
        to: z.date().optional(),
      }),
      companyName: z.string().optional(), // Optional field for freelance or employment-based projects
    })
  ),
  education: z.array(
    z.object({
      school: z.string().min(1, { message: "School is required." }),
      degree: z.string().min(1, { message: "Degree is required." }),
      major: z.string().min(1, { message: "Major is required." }),
      graduationDateRange: z.object({
        from: z.date({
          required_error: "Please indicate the start of your education",
        }),
        to: z.date({ required_error: "Please indicate the graduation date" }),
      }),
    })
  ),
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
  certifications: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, { message: "Certification title is required." }),
        issuingOrganization: z.string().min(1, {
          message: "Issuing organization is required.",
        }),
        issueDate: z.date({
          required_error: "Please indicate the issue date",
        }),
        expirationDate: z.date().optional(),
        credentialID: z.string().optional(),
        credentialURL: z.string().url().optional(),
      })
    )
    .optional(),
});

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ResumeForm() {
  const form = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personalInfo: {
        fullName: "",
        location: "",
        email: "",
        contactNumber: "",
        github: "",
        linkedIn: "",
      },
      skills: [{ category: "", items: "" }],
      experiences: [
        {
          company: "",
          position: "",
          duration: {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
          },
          description: "",
        },
      ],
      projects: [
        {
          name: "",
          description: "",
          duration: {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
          },
          companyName: "",
        },
      ],
      activities: [
        {
          name: "",
          role: "",
          duration: {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
          },
          description: "",
        },
      ],
      education: [
        {
          school: "",
          degree: "",
          major: "",
          graduationDateRange: {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
          },
        },
      ],
      certifications: [
        {
          title: "",
          issuingOrganization: "",
          issueDate: new Date().toISOString(),
          expirationDate: new Date().toISOString(),
          credentialID: "",
          credentialURL: "",
        },
      ],
    },
  });

  const {
    fields: skillFields,
    append: addSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const {
    fields: experienceFields,
    append: addExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  const {
    fields: projectFields,
    append: addProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const {
    fields: activityFields,
    append: addActivity,
    remove: removeActivity,
  } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  const {
    fields: certificationFields,
    append: addCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  function onSubmit(values: z.infer<typeof resumeSchema>) {
    console.log(values);
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Resume Builder</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={"personalInfo.fullName"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={"personalInfo.location"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={"personalInfo.email"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"personalInfo.contactNumber"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Contact Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"personalInfo.github"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Github Link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"personalInfo.linkedIn"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="LinkedIn Link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Technical Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillFields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <FormField 
                  control={form.control}
                  name={`skills.${index}.category`}
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Skill Category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name={`skills.${index}.items`}
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Enter skills, separated by commas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  {index > 0 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSkill(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button onClick={() => addSkill({ category: "", items: "" })}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Skill Category
              </Button>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <FormField 
                  control={form.control}
                  name={`experiences.${index}.company`}
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  <Input
                    placeholder="Company"
                    {...register(`experiences.${index}.company`)}
                  />
                  <Input
                    placeholder="Position"
                    {...register(`experiences.${index}.position`)}
                  />

                  <Input
                    placeholder="Duration"
                    {...register(`experiences.${index}.duration`)}
                  />
                  <Textarea
                    placeholder="Description"
                    {...register(`experiences.${index}.description`)}
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
                    duration: "",
                    description: "",
                  })
                }
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>

          {/* Education */}

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectFields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <Input
                    placeholder="Project Name"
                    {...register(`projects.${index}.name`)}
                  />
                  <Textarea
                    placeholder="Project Description"
                    {...register(`projects.${index}.description`)}
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
              <Button onClick={() => addProject({ name: "", description: "" })}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>

          {/* Leadership Experience & Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Leadership Experience & Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activityFields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <Input
                    placeholder="Activity Name"
                    {...register(`activities.${index}.name`)}
                  />
                  <Input
                    placeholder="Role"
                    {...register(`activities.${index}.role`)}
                  />
                  <Input
                    placeholder="Duration"
                    {...register(`activities.${index}.duration`)}
                  />
                  <Textarea
                    placeholder="Description"
                    {...register(`activities.${index}.description`)}
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
                    duration: "",
                    description: "",
                  })
                }
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Generate Resume
          </Button>
        </form>
      </Form>
    </div>
  );
}
