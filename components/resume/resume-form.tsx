"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";

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
  certifications: z.array(
    z.object({

    })
  ).optional()
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
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
        { company: "", position: "", duration: "", description: "" },
      ],
      projects: [{ name: "", description: "" }],
      activities: [{ name: "", role: "", duration: "", description: "" }],
    },
  });

  const {
    fields: skillFields,
    append: addSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const {
    fields: experienceFields,
    append: addExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  const {
    fields: projectFields,
    append: addProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const {
    fields: activityFields,
    append: addActivity,
    remove: removeActivity,
  } = useFieldArray({
    control,
    name: "activities",
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // You can send the form data via Axios here
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Resume Builder</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Full Name"
                {...register("personalInfo.fullName")}
              />
              {errors.personalInfo?.fullName && (
                <p className="text-red-500">
                  {errors.personalInfo.fullName.message}
                </p>
              )}

              <Input
                placeholder="Location"
                {...register("personalInfo.location")}
              />
              {errors.personalInfo?.location && (
                <p className="text-red-500">
                  {errors.personalInfo.location.message}
                </p>
              )}

              <Input
                type="email"
                placeholder="Email"
                {...register("personalInfo.email")}
              />
              {errors.personalInfo?.email && (
                <p className="text-red-500">
                  {errors.personalInfo.email.message}
                </p>
              )}

              <Input
                placeholder="Contact Number"
                {...register("personalInfo.contactNumber")}
              />

              <Input
                placeholder="GitHub Link"
                {...register("personalInfo.github")}
              />
              <Input
                placeholder="LinkedIn"
                {...register("personalInfo.linkedIn")}
              />
            </div>
          </CardContent>
        </Card>
        {/* Education */}

        {/* Technical Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillFields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <Input
                  placeholder="Skill Category"
                  {...register(`skills.${index}.category`)}
                />
                {errors.skills?.[index]?.category && (
                  <p className="text-red-500">
                    {errors.skills[index]?.category?.message}
                  </p>
                )}
                <Textarea
                  placeholder="Enter skills, separated by commas"
                  {...register(`skills.${index}.items`)}
                />
                {errors.skills?.[index]?.items && (
                  <p className="text-red-500">
                    {errors.skills[index]?.items?.message}
                  </p>
                )}
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
    </div>
  );
}
