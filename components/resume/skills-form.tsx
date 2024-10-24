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
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

export const skillsSchema = z.object({
  skills: z.array(
    z.object({
      category: z.string().min(1, { message: "Category is required." }),
      items: z.string().min(1, { message: "At least one skill is required." }),
    })
  ),
});
export default function SkillsForm() {
  const form = useForm<z.infer<typeof skillsSchema>>({
    mode: "onSubmit",
    shouldUnregister: false,
    resolver: zodResolver(skillsSchema),
  });

  const {
    fields: skillFields,
    append: addSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  function onSubmit(values: z.infer<typeof skillsSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {skillFields.map((field, index) => (
              <div key={field.id} className="space-y-2">
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
                <FormField
                  control={form.control}
                  name={`skills.${index}.items`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter skills, separated by commas"
                          {...field}
                        />
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
      </form>
    </Form>
  );
}
