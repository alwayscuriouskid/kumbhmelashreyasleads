import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TableColumnToggle } from "@/components/shared/TableColumnToggle";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";

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
  sortBy: string;
  onSortChange: (value: string) => void;
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
  sortBy,
  onSortChange,
}: TeamActivityFiltersProps) => {
  const [dateFilterType, setDateFilterType] = useState("all");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const { data: teamMembers } = useTeamMemberOptions();

  console.log("Rendering TeamActivityFilters with sort option:", sortBy);

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
    if (startDate && endDate) {
      onDateSelect(startDate);
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
            {teamMembers?.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
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

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Date (Newest First)</SelectItem>
            <SelectItem value="date_asc">Date (Oldest First)</SelectItem>
            <SelectItem value="follow_up_desc">Follow-up Date (Latest First)</SelectItem>
            <SelectItem value="follow_up_asc">Follow-up Date (Earliest First)</SelectItem>
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