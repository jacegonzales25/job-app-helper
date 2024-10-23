/* eslint-disable no-unused-vars */
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState, ReactNode } from "react";

type Step = {
  title: string;
  component: ReactNode;
};

type MultiStepFormProps = {
  steps: Step[];
  onStepComplete: (stepIndex: number) => void;
  onFormComplete: () => void;
};

export default function MultiStepForm({
  steps,
  onStepComplete,
  onFormComplete,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepComplete(currentStep);
      setCurrentStep(currentStep + 1);
    } else {
      onFormComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {steps[currentStep].component}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentStep === 0} variant="outline">
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Complete" : "Next"}
          </Button>
        </CardFooter>
      </Card>
      <div className="flex justify-center mt-4 space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-3 h-3 rounded-full",
              index === currentStep ? "bg-primary" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  )


}
