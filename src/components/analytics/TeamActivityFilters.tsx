import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TableColumnToggle } from "@/components/shared/TableColumnToggle";

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
        
        <DatePicker
          selected={selectedDate}
          onSelect={onDateSelect}
          placeholderText="Select date"
        />

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