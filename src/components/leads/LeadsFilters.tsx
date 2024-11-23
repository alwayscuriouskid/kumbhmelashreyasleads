import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface LeadsFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  visibleColumns: Record<string, boolean>;
  toggleColumn: (column: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
}

const LeadsFilters = ({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  visibleColumns,
  toggleColumn,
  dateFilter,
  setDateFilter,
  locationFilter,
  setLocationFilter,
}: LeadsFiltersProps) => {
  const [dateFilterType, setDateFilterType] = useState("all");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  // Define the available lead statuses
  const leadStatuses = [
    "suspect",
    "prospect",
    "analysis",
    "negotiation",
    "conclusion",
    "ongoing_order"
  ];

  const formatStatusLabel = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilterType(value);
    
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

    setDateFilter(newDate);
  };

  const handleCustomDateRange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    if (startDate && endDate) {
      setDateFilter(startDate);
    }
  };

  return (
    <Card className="mb-6 p-4 space-y-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-wrap gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {leadStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {formatStatusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilterType} onValueChange={handleDateFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {dateFilterType === "custom" && (
          <div className="flex gap-2">
            <DatePicker
              selected={customStartDate}
              onSelect={(date) => handleCustomDateRange(date, customEndDate)}
              placeholderText="Start date"
            />
            <DatePicker
              selected={customEndDate}
              onSelect={(date) => handleCustomDateRange(customStartDate, date)}
              placeholderText="End date"
            />
          </div>
        )}

        <Input
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-[200px]"
        />

        <Input
          placeholder="Search by client name or contact person..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      <div>
        <h3 className="font-medium mb-2">Visible Columns:</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(visibleColumns).map(([column, isVisible]) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={column}
                checked={isVisible}
                onCheckedChange={() => toggleColumn(column)}
              />
              <label htmlFor={column} className="text-sm capitalize">
                {column.replace(/([A-Z])/g, " $1").trim()}
              </label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LeadsFilters;