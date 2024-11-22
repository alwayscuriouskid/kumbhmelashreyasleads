import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TableColumnToggle } from "@/components/shared/TableColumnToggle";
import { useState } from "react";

interface TeamActivityFiltersProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  selectedTeamMember: string;
  onTeamMemberSelect: (value: string) => void;
  activityType: string;
  onActivityTypeSelect: (value: string) => void;
  leadSearch: string;
  onLeadSearchChange: (value: string) => void;
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (columnKey: string) => void;
}

const TeamActivityFilters = ({
  selectedDate,
  onDateSelect,
  selectedTeamMember,
  onTeamMemberSelect,
  activityType,
  onActivityTypeSelect,
  leadSearch,
  onLeadSearchChange,
  visibleColumns,
  onToggleColumn,
}: TeamActivityFiltersProps) => {
  const [dateFilterType, setDateFilterType] = useState("all");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();

  const columns = [
    { key: "time", label: "Time" },
    { key: "type", label: "Type" },
    { key: "description", label: "Description" },
    { key: "teamMember", label: "Team Member" },
    { key: "leadName", label: "Lead" },
    { key: "statusChange", label: "Status Change" },
    { key: "nextFollowUp", label: "Next Follow-up" },
    { key: "followUpOutcome", label: "Follow-up Outcome" },
    { key: "nextAction", label: "Next Action" },
    { key: "activityOutcome", label: "Activity Outcome" },
  ];

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
        // Don't set any date, wait for custom range selection
        newDate = undefined;
        break;
      default:
        newDate = undefined;
    }

    onDateSelect(newDate);
  };

  const handleCustomDateRange = (startDate: Date | undefined, endDate: Date | undefined) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    // Pass the date range to parent component
    if (startDate && endDate) {
      onDateSelect(startDate); // You might want to modify the parent component to handle date ranges
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select value={selectedTeamMember} onValueChange={onTeamMemberSelect}>
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
        
        <Select value={activityType} onValueChange={onActivityTypeSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select activity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="status_change">Status Changes</SelectItem>
            <SelectItem value="call">Calls</SelectItem>
            <SelectItem value="meeting">Meetings</SelectItem>
            <SelectItem value="email">Emails</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilterType} onValueChange={handleDateFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date filter" />
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
          placeholder="Search by lead name..."
          value={leadSearch}
          onChange={(e) => onLeadSearchChange(e.target.value)}
          className="w-[200px]"
        />
      </div>

      <TableColumnToggle
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={onToggleColumn}
      />
    </Card>
  );
};

export default TeamActivityFilters;