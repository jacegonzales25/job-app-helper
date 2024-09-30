'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2 } from "lucide-react";

// Use axios instead

export default function ResumeForm() {
  const [experiences, setExperiences] = useState([
    { company: "", position: "", duration: "", description: "" },
  ]);
  const [projects, setProjects] = useState([{ name: "", description: "" }]);
  const [activities, setActivities] = useState([
    { name: "", role: "", duration: "", description: "" },
  ]);

  const addExperience = () =>
    setExperiences([
      ...experiences,
      { company: "", position: "", duration: "", description: "" },
    ]);
  const addProject = () =>
    setProjects([...projects, { name: "", description: "" }]);
  const addActivity = () =>
    setActivities([
      ...activities,
      { name: "", role: "", duration: "", description: "" },
    ]);

    const [skills, setSkills] = useState([
      { category: "Languages", items: "" },
      { category: "Frontend Development", items: "" },
      { category: "Backend Development", items: "" },
      { category: "Development Environments", items: "" },
      { category: "API Development", items: "" },
      { category: "Tools", items: "" },
      { category: "Database", items: "" },
      { category: "Hosting Services", items: "" },
    ])
  
    const addSkill = () => {
      setSkills([...skills, { category: "", items: "" }])
    }
  
    const updateSkill = (index: number, field: 'category' | 'items', value: string) => {
      const updatedSkills = [...skills]
      updatedSkills[index][field] = value
      setSkills(updatedSkills)
    }
  
    const removeSkill = (index: number) => {
      const updatedSkills = skills.filter((_, i) => i !== index)
      setSkills(updatedSkills)
    }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Resume Builder</h1>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Full Name" />
            <Input placeholder="Location" />
            <Input type="email" placeholder="Email" />
            <Input placeholder="Contact Number" />
            <Input placeholder="GitHub Link" />
            <Input placeholder="LinkedIn" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Skill Category"
                  value={skill.category}
                  onChange={(e) => updateSkill(index, 'category', e.target.value)}
                  className="flex-grow"
                />
                {index >= 8 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="Enter skills, separated by commas"
                value={skill.items}
                onChange={(e) => updateSkill(index, 'items', e.target.value)}
              />
            </div>
          ))}
          <Button onClick={addSkill}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Skill Category
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Institution Name" />
          <Input placeholder="Degree" />
          <Input placeholder="Location" />
          <Input placeholder="Expected Graduation Date" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="space-y-2">
              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => {
                  const newExperiences = [...experiences];
                  newExperiences[index].company = e.target.value;
                  setExperiences(newExperiences);
                }}
              />
              <Input
                placeholder="Position"
                value={exp.position}
                onChange={(e) => {
                  const newExperiences = [...experiences];
                  newExperiences[index].position = e.target.value;
                  setExperiences(newExperiences);
                }}
              />
              <Input
                placeholder="Duration"
                value={exp.duration}
                onChange={(e) => {
                  const newExperiences = [...experiences];
                  newExperiences[index].duration = e.target.value;
                  setExperiences(newExperiences);
                }}
              />
              <Textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) => {
                  const newExperiences = [...experiences];
                  newExperiences[index].description = e.target.value;
                  setExperiences(newExperiences);
                }}
              />
              {index > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const newExperiences = experiences.filter(
                      (_, i) => i !== index
                    );
                    setExperiences(newExperiences);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Experience
                </Button>
              )}
            </div>
          ))}
          <Button onClick={addExperience}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.map((project, index) => (
            <div key={index} className="space-y-2">
              <Input
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => {
                  const newProjects = [...projects];
                  newProjects[index].name = e.target.value;
                  setProjects(newProjects);
                }}
              />
              <Textarea
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => {
                  const newProjects = [...projects];
                  newProjects[index].description = e.target.value;
                  setProjects(newProjects);
                }}
              />
              {index > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const newProjects = projects.filter((_, i) => i !== index);
                    setProjects(newProjects);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Project
                </Button>
              )}
            </div>
          ))}
          <Button onClick={addProject}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leadership Experience & Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="space-y-2">
              <Input
                placeholder="Activity Name"
                value={activity.name}
                onChange={(e) => {
                  const newActivities = [...activities];
                  newActivities[index].name = e.target.value;
                  setActivities(newActivities);
                }}
              />
              <Input
                placeholder="Role"
                value={activity.role}
                onChange={(e) => {
                  const newActivities = [...activities];
                  newActivities[index].role = e.target.value;
                  setActivities(newActivities);
                }}
              />
              <Input
                placeholder="Duration"
                value={activity.duration}
                onChange={(e) => {
                  const newActivities = [...activities];
                  newActivities[index].duration = e.target.value;
                  setActivities(newActivities);
                }}
              />
              <Textarea
                placeholder="Description"
                value={activity.description}
                onChange={(e) => {
                  const newActivities = [...activities];
                  newActivities[index].description = e.target.value;
                  setActivities(newActivities);
                }}
              />
              {index > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const newActivities = activities.filter(
                      (_, i) => i !== index
                    );
                    setActivities(newActivities);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Activity
                </Button>
              )}
            </div>
          ))}
          <Button onClick={addActivity}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </CardContent>
      </Card>

      <Button className="w-full">Generate Resume</Button>
    </div>
  );
}
