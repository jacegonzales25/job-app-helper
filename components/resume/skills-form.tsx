"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, X } from "lucide-react";
import { useResumeStore } from "@/store/resume-store";

export const skillsSchema = z.object({
  skills: z.array(
    z.object({
      category: z.string().min(1, { message: "Category is required." }),
      items: z
        .array(z.string())
        .min(1, { message: "At least one skill is required." }),
    })
  ),
});

export default function SkillsForm() {
  const store = useResumeStore();
  const skillsInfo = store.skillsInfo;
  const [newSkill, setNewSkill] = useState("");

  const form = useForm<z.infer<typeof skillsSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: skillsInfo?.skills || [{ category: "", items: [] }],
    },
  });

  const {
    fields: skillFields,
    append: addSkillCategory,
    remove: removeSkillCategory,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  function onSubmit(values: z.infer<typeof skillsSchema>) {
    store.updateSkillsInfo(values);
    console.log("Form Submitted: ", values);
  }

  const addSkillItem = (index: number) => {
    if (newSkill.trim()) {
      const currentItems = form.getValues(`skills.${index}.items`);
      form.setValue(`skills.${index}.items`, [
        ...currentItems,
        newSkill.trim(),
      ]);
      setNewSkill("");
    }
  };

  const removeSkillItem = (categoryIndex: number, skillIndex: number) => {
    const currentItems = form.getValues(`skills.${categoryIndex}.items`);
    form.setValue(
      `skills.${categoryIndex}.items`,
      currentItems.filter((_, index) => index !== skillIndex)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {skillFields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                {index > 0 && <Separator className="my-6" />}
                <FormField
                  control={form.control}
                  name={`skills.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Skill Category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-2">
                  {form
                    .watch(`skills.${index}.items`)
                    .map((item, itemIndex) => (
                      <Button
                        key={itemIndex}
                        variant="secondary"
                        size="sm"
                        onClick={() => removeSkillItem(index, itemIndex)}
                      >
                        {item}
                        <X className="ml-2 h-4 w-4" />
                      </Button>
                    ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                  <Button type="button" onClick={() => addSkillItem(index)}>
                    Add
                  </Button>
                </div>
                {index > 0 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSkillCategory(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addSkillCategory({ category: "", items: [] })}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Skill Category
            </Button>
          </CardContent>
        </Card>
        <Button type="submit" className="mt-4">
          Save Skills
        </Button>
      </form>
    </Form>
  );
}
