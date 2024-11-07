"use client";

import { useState, useEffect } from "react";
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
import { PlusCircle, Trash2, X } from "lucide-react";
import { useResumeStore } from "@/store/resume-store";
import { Badge } from "@/components/ui/badge";

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
  const skillsInfo = store.skillsInfo || { skills: [] };
  const updateSkillsInfo = store.updateSkillsInfo;

  // Maintain Zustand state as default values
  const form = useForm<z.infer<typeof skillsSchema>>({
    mode: "onChange",
    resolver: zodResolver(skillsSchema),
    defaultValues: { skills: skillsInfo.skills },
  });

  const {
    fields: skillFields,
    append: addSkillCategory,
    remove: removeSkillCategory,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  useEffect(() => {
    // Watch the form and update Zustand store whenever there's a change
    const subscription = form.watch((values) => {
      const filledValues = {
        skills: values.skills?.map((skill) => ({
          category: skill?.category || "",
          items: (skill?.items || []).filter(Boolean) as string[], // Ensure items is an array of strings only
        })) || [],
      };
      updateSkillsInfo(filledValues);
    });
    return () => subscription.unsubscribe();
  }, [form, updateSkillsInfo]);
  

  // Use individual state per input for adding new skills in categories
  const [newSkill, setNewSkill] = useState<string[]>([]);

  const addSkillItem = (index: number) => {
    if (newSkill[index]?.trim()) {
      const currentItems = form.getValues(`skills.${index}.items`);
      form.setValue(`skills.${index}.items`, [
        ...currentItems,
        newSkill[index].trim(),
      ]);

      // Clear the specific skill input field
      setNewSkill((prev) => {
        const updatedSkills = [...prev];
        updatedSkills[index] = "";
        return updatedSkills;
      });
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
      <form
        onSubmit={form.handleSubmit(() => console.log("Skills submitted"))}
        className="space-y-8"
      >
        <Card className="shadow-md">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-2xl font-bold">
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {skillFields.map((field, index) => (
              <Card
                key={field.id}
                className="p-4 bg-background border-2 border-muted"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name={`skills.${index}.category`}
                      render={({ field }) => (
                        <FormItem className="flex-grow mr-4">
                          <FormLabel className="text-sm font-medium">
                            Skill Category
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Programming Languages"
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSkillCategory(index)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-muted/30 rounded-md">
                    {form
                      .watch(`skills.${index}.items`)
                      .map((item, itemIndex) => (
                        <Badge
                          key={itemIndex}
                          variant="secondary"
                          className="px-2 py-1 text-sm flex items-center gap-1 bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          {item}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 rounded-full p-0 hover:bg-destructive/10"
                            onClick={() => removeSkillItem(index, itemIndex)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill[index] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewSkill((prev) => {
                          const updatedSkills = [...prev];
                          updatedSkills[index] = value;
                          return updatedSkills;
                        });
                      }}
                      className="flex-grow bg-background"
                    />
                    <Button
                      type="button"
                      onClick={() => addSkillItem(index)}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              onClick={() => addSkillCategory({ category: "", items: [] })}
              variant="outline"
              className="w-full"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Skill Category
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
