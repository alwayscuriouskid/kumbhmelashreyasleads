import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";

interface OrderDateFiltersProps {
  onDateFilterChange: (type: string, date: Date | undefined) => void;
}

export const OrderDateFilters = ({ onDateFilterChange }: OrderDateFiltersProps) => {
  const [orderDateType, setOrderDateType] = useState("all");
  const [nextPaymentDateType, setNextPaymentDateType] = useState("all");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  const handleDateFilterChange = (filterType: "order" | "payment", value: string) => {
    const today = new Date();
    let newDate: Date | undefined;

    switch (value) {
      case "today":
        newDate = today;
        break;
      case "yesterday":
        newDate = new Date(today.setDate(today.getDate() - 1));
        break;
      case "thisWeek":
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        newDate = startOfWeek;
        break;
      case "custom":
        newDate = undefined;
        break;
      default:
        newDate = undefined;
    }

    if (filterType === "order") {
      setOrderDateType(value);
      onDateFilterChange("orderDate", newDate);
    } else {
      setNextPaymentDateType(value);
      onDateFilterChange("nextPaymentDate", newDate);
    }
  };

  const handleCustomDateRange = (
    filterType: "order" | "payment",
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => {
    if (filterType === "order") {
      setCustomStartDate(startDate);
      setCustomEndDate(endDate);
      if (startDate && endDate) {
        onDateFilterChange("orderDate", startDate);
      }
    } else {
      if (startDate) {
        onDateFilterChange("nextPaymentDate", startDate);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Order Date</label>
        <Select value={orderDateType} onValueChange={(v) => handleDateFilterChange("order", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by order date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        {orderDateType === "custom" && (
          <div className="flex gap-2 mt-2">
            <DatePicker
              selected={customStartDate}
              onSelect={(date) => handleCustomDateRange("order", date, customEndDate)}
              placeholderText="Start date"
            />
            <DatePicker
              selected={customEndDate}
              onSelect={(date) => handleCustomDateRange("order", customStartDate, date)}
              placeholderText="End date"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Next Payment Date</label>
        <DatePicker
          selected={undefined}
          onSelect={(date) => handleCustomDateRange("payment", date, undefined)}
          placeholderText="Filter by next payment"
        />
      </div>
    </div>
  );
};