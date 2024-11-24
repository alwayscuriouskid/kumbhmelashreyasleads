import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
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
  const { data: teamMembers } = useTeamMemberOptions();

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg">
      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedTeamMember} onValueChange={onTeamMemberSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Team member" />
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
            <SelectValue placeholder="Activity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="call">Calls</SelectItem>
            <SelectItem value="meeting">Meetings</SelectItem>
            <SelectItem value="email">Emails</SelectItem>
            <SelectItem value="note">Notes</SelectItem>
            <SelectItem value="follow_up">Follow-ups</SelectItem>
          </SelectContent>
        </Select>

        <DatePicker
          selected={selectedDate}
          onSelect={onDateSelect}
          placeholderText="Activity date"
        />

        <DatePicker
          selected={nextActionDateFilter}
          onSelect={onNextActionDateSelect}
          placeholderText="Next action date"
        />

        <Input
          placeholder="Search leads..."
          value={leadSearch}
          onChange={(e) => onLeadSearchChange(e.target.value)}
          className="w-[200px]"
        />

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Latest First</SelectItem>
            <SelectItem value="date_asc">Oldest First</SelectItem>
            <SelectItem value="next_action_desc">Next Action (Latest)</SelectItem>
            <SelectItem value="next_action_asc">Next Action (Earliest)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TeamActivityFilters;