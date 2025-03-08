import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  buttonClassName?: string;
  align?: "center" | "start" | "end";
  placeholder?: string;
  showTime?: boolean;
}

export function DateTimePicker({
  date,
  setDate,
  buttonClassName,
  align = "center",
  placeholder = "Sélectionner la date",
  showTime = true,
}: DateTimePickerProps) {
  const [selectedHour, setSelectedHour] = React.useState<string>(
    date ? format(date, "HH") : "12"
  );
  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    date ? format(date, "mm") : "00"
  );

  // Generate options for hours and minutes
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Update the time when hour or minute changes
  React.useEffect(() => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(selectedHour, 10));
      newDate.setMinutes(parseInt(selectedMinute, 10));
      setDate(newDate);
    }
  }, [selectedHour, selectedMinute, date, setDate]);

  // Handle calendar date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      // Keep the current time if it exists
      if (date) {
        newDate.setHours(date.getHours(), date.getMinutes());
      } else {
        newDate.setHours(parseInt(selectedHour, 10), parseInt(selectedMinute, 10));
      }
      setDate(newDate);
    } else {
      setDate(undefined);
    }
  };

  // Format the displayed date-time
  const formattedDateTime = React.useMemo(() => {
    if (!date) return placeholder;
    const datePattern = showTime ? "dd MMMM yyyy à HH:mm" : "dd MMMM yyyy";
    return format(date, datePattern, { locale: fr });
  }, [date, placeholder, showTime]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            buttonClassName
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDateTime}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="p-4 pb-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={fr}
          />
        </div>
        
        {showTime && (
          <div className="border-t p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Heure</span>
            </div>
            <div className="flex gap-2">
              <Select 
                value={selectedHour} 
                onValueChange={setSelectedHour}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="Heure" />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="flex items-center">:</span>
              
              <Select 
                value={selectedMinute} 
                onValueChange={setSelectedMinute}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="border-t p-3 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDate(undefined)}
          >
            Effacer
          </Button>
          <Button
            size="sm"
            onClick={() => document.body.click()} // Close the popover
          >
            Appliquer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
