'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from './label'
import { Switch } from './switch'
export type YearMonthSelectorProps = {
  year: number
  month: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  isCurrentlyEmployed: boolean
  onCurrentlyEmployedChange: (isCurrentlyEmployed: boolean) => void
  type: string
  className?: string
}

export function YearMonthSelectorOptional({
  year,
  month,
  onYearChange,
  onMonthChange,
  isCurrentlyEmployed,
  onCurrentlyEmployedChange,
  type,
  className,
}: YearMonthSelectorProps) {
  const startYear = 1950
  const endYear = 2050

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  return (
    <Card className={cn("w-full max-w-sm mx-auto", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onYearChange(year - 1)}
              disabled={year <= startYear}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={year.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue>{year}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-80">
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onYearChange(year + 1)}
              disabled={year >= endYear}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select value={month.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 opacity-50" />
                <SelectValue>{format(new Date(year, month - 1), 'MMMM')}</SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {months.map((m, index) => (
                <SelectItem key={m} value={(index + 1).toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between mb-4">
              <Label htmlFor="currently-employed" className="text-sm font-medium">
                Currently {type}
              </Label>
              <Switch
                id="currently-employed"
                checked={isCurrentlyEmployed}
                onCheckedChange={onCurrentlyEmployedChange}
              />
            </div>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Selected: {format(new Date(year, month - 1), 'MMMM yyyy')}
        </div>
      </CardContent>
    </Card>
  )
}