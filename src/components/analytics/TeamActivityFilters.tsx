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
  nextActionDateFilter: Date | undefined;
  onNextActionDateSelect: (date: Date | undefined) => void;
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
  nextActionDateFilter,
  onNextActionDateSelect,
}: TeamActivityFiltersProps) => {
  const [dateFilterType, setDateFilterType] = useState("all");
  const { data: teamMembers } = useTeamMemberOptions();

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
            <SelectItem value="next_action_desc">Next Action (Latest First)</SelectItem>
            <SelectItem value="next_action_asc">Next Action (Earliest First)</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <label className="text-sm font-medium">Activity Date</label>
          <Select value={dateFilterType} onValueChange={handleDateFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="custom">Custom Date</SelectItem>
            </SelectContent>
          </Select>
          
          {dateFilterType === "custom" && (
            <DatePicker
              selected={selectedDate}
              onSelect={onDateSelect}
              placeholderText="Select date"
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Next Action Date</label>
          <DatePicker
            selected={nextActionDateFilter}
            onSelect={onNextActionDateSelect}
            placeholderText="Filter by next action date"
          />
        </div>

        <Input
          placeholder="Search by lead name..."
          value={leadSearch}
          onChange={(e) => onLeadSearchChange(e.target.value)}
          className="w-[200px]"
        />
      </div>

      <TableColumnToggle
        columns={[
          { key: "time", label: "Time" },
          { key: "type", label: "Type" },
          { key: "notes", label: "Notes" },
          { key: "teamMember", label: "Team Member" },
          { key: "leadName", label: "Lead" },
          { key: "activityType", label: "Activity Type" },
          { key: "activityOutcome", label: "Activity Outcome" },
          { key: "activityNextAction", label: "Next Action" },
          { key: "activityNextActionDate", label: "Next Action Date" },
        ]}
        visibleColumns={visibleColumns}
        onToggleColumn={onToggleColumn}
      />
    </Card>
  );
};

export default TeamActivityFilters;