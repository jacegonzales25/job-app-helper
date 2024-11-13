'use client'

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, BookOpen, Briefcase, Lightbulb, Award, Target, Star } from 'lucide-react'
import PersonalForm from "./personal-form"
import EducationForm from "./education-form"
import SkillsForm from "./skills-form"
import ExperienceForm from "./experiences-form"
import ActivitiesForm from "./activities-form"
import ProjectForm from "./projects-form"
import CertificationsForm from "./certifications-form"

export default function ResumeTabs() {
  const [activeTab, setActiveTab] = useState("personal-info")

  const tabs = [
    { id: "personal-info", label: "Personal", icon: UserCircle, component: PersonalForm },
    { id: "skills", label: "Skills", icon: Lightbulb, component: SkillsForm },
    { id: "education", label: "Education", icon: BookOpen, component: EducationForm },
    { id: "experience", label: "Work Experience", icon: Briefcase, component: ExperienceForm },
    { id: "projects", label: "Projects (Optional)", icon: Award, component: ProjectForm },
    { id: "activities", label: "Activities (Optional)", icon: Target, component: ActivitiesForm },
    { id: "certifications", label: "Certifications (Optional)", icon: Star, component: CertificationsForm },
  ]

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab)

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-5xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Resume Builder</CardTitle>
          <CardDescription className="text-lg mt-2">Create your comprehensive professional resume</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="space-y-2">
              <TabsList className="flex flex-wrap justify-center gap-2 bg-muted p-1 rounded-lg">
                {tabs.slice(0, 4).map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm transition-all duration-300 ease-in-out data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsList className="flex flex-wrap justify-center gap-2 bg-muted p-1 rounded-lg">
                {tabs.slice(4).map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm transition-all duration-300 ease-in-out data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <tab.component />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between p-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveTab(tabs[currentTabIndex - 1]?.id)}
            disabled={currentTabIndex === 0}
          >
            Previous
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (currentTabIndex === tabs.length - 1) {
                // Handle form submission
                console.log("Form submitted")
              } else {
                setActiveTab(tabs[currentTabIndex + 1]?.id)
              }
            }}
          >
            {currentTabIndex === tabs.length - 1 ? "Submit" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}