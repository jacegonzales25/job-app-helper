// "use client"

// import React from "react"
// import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
// import { format, setMonth, setYear } from "date-fns"
// import { useController, Control, FieldValues, FieldPath } from "react-hook-form"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// const months = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
// ]

// interface DateRangePickerProps<
//   TFieldValues extends FieldValues = FieldValues,
//   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// > {
//   control?: Control<TFieldValues>
//   name: TName
// }

// export default function DateRangePicker<
//   TFieldValues extends FieldValues = FieldValues,
//   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// >({ control, name }: DateRangePickerProps<TFieldValues, TName>) {
//   const [localValue, setLocalValue] = React.useState({ from: new Date(), to: new Date() })

//   const controllerResult = control
//     ? useController({
//         name,
//         control,
//         defaultValue: { from: new Date(), to: new Date() },
//       })
//     : null

//   const value = controllerResult ? controllerResult.field.value : localValue
//   const onChange = controllerResult ? controllerResult.field.onChange : setLocalValue

//   const handleFromChange = (newDate: Date) => {
//     onChange({ ...value, from: newDate })
//   }

//   const handleToChange = (newDate: Date) => {
//     onChange({ ...value, to: newDate })
//   }

//   const YearSelector = ({ date, onChangeDate, label }: { date: Date; onChangeDate: (date: Date) => void; label: string }) => (
//     <div className="flex items-center justify-between mb-2">
//       <Button
//         size="icon"
//         variant="outline"
//         onClick={() => onChangeDate(setYear(date, Math.max(1970, date.getFullYear() - 1)))}
//         disabled={date.getFullYear() <= 1970}
//       >
//         <ChevronLeft className="h-4 w-4" />
//       </Button>
//       <span className="text-sm font-medium">{label}: {date.getFullYear()}</span>
//       <Button
//         size="icon"
//         variant="outline"
//         onClick={() => onChangeDate(setYear(date, Math.min(new Date().getFullYear(), date.getFullYear() + 1)))}
//         disabled={date.getFullYear() >= new Date().getFullYear()}
//       >
//         <ChevronRight className="h-4 w-4" />
//       </Button>
//     </div>
//   )

//   const MonthSelector = ({ date, onChangeDate }: { date: Date; onChangeDate: (date: Date) => void }) => (
//     <Select
//       value={date.getMonth().toString()}
//       onValueChange={(newMonth) => onChangeDate(setMonth(date, parseInt(newMonth)))}
//     >
//       <SelectTrigger className="w-full">
//         <SelectValue placeholder="Select month" />
//       </SelectTrigger>
//       <SelectContent>
//         {months.map((month, index) => (
//           <SelectItem key={month} value={index.toString()}>
//             {month}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   )

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant={"outline"}
//           className={cn(
//             "w-full justify-start text-left font-normal",
//             !value && "text-muted-foreground"
//           )}
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {value?.from && value?.to ? (
//             <>
//               {format(value.from, "MMM yyyy")} - {format(value.to, "MMM yyyy")}
//             </>
//           ) : (
//             <span>Pick a date range</span>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-4" align="start">
//         <div className="grid gap-4">
//           <div>
//             <h4 className="font-medium mb-2">From</h4>
//             <YearSelector
//               date={value.from}
//               onChangeDate={handleFromChange}
//               label="Year"
//             />
//             <MonthSelector
//               date={value.from}
//               onChangeDate={handleFromChange}
//             />
//           </div>
//           <div>
//             <h4 className="font-medium mb-2">To</h4>
//             <YearSelector
//               date={value.to}
//               onChangeDate={handleToChange}
//               label="Year"
//             />
//             <MonthSelector
//               date={value.to}
//               onChangeDate={handleToChange}
//             />
//           </div>
//         </div>
//       </PopoverContent>
//     </Popover>
//   )
// }