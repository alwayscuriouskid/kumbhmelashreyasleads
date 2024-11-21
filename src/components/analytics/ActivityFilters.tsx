import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";

interface ActivityFiltersProps {
  onFilterChange: (filters: {
    timeRange: string;
    teamMember?: string;
    startDate?: Date;
    endDate?: Date;
  }) => void;
}

const ActivityFilters = ({ onFilterChange }: ActivityFiltersProps) => {
  const [timeRange, setTimeRange] = useState("today");
  const [teamMember, setTeamMember] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleFilterChange = () => {
    onFilterChange({
      timeRange,
      teamMember,
      startDate,
      endDate,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select value={timeRange} onValueChange={(value) => {
          setTimeRange(value);
          handleFilterChange();
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="lastWeek">Last Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        <Select value={teamMember} onValueChange={(value) => {
          setTeamMember(value);
          handleFilterChange();
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members</SelectItem>
            <SelectItem value="john">John Doe</SelectItem>
            <SelectItem value="jane">Jane Smith</SelectItem>
            <SelectItem value="mike">Mike Johnson</SelectItem>
          </SelectContent>
        </Select>

        {timeRange === "custom" && (
          <div className="flex gap-2">
            <DatePicker
              selected={startDate}
              onSelect={(date) => {
                setStartDate(date);
                handleFilterChange();
              }}
              placeholderText="Start date"
            />
            <DatePicker
              selected={endDate}
              onSelect={(date) => {
                setEndDate(date);
                handleFilterChange();
              }}
              placeholderText="End date"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFilters;