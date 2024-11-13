"use client";

import React, { useState, ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step = {
  component: ReactNode;
};

type MultiStepFormProps = {
  steps: Step[];
  onFormComplete: () => void;
};

export default function MultiStepForm({ steps, onFormComplete }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto p-4">
        <Card className="shadow-lg">
          <CardContent className="my-5">
            {steps[currentStep].component}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
            >
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
    </div>
  );
}
