import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import PendingActionsList from "./pending-actions/PendingActionsList";
import { usePendingActions } from "./pending-actions/usePendingActions";

const PendingActionsTab = () => {
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>("all");
  const [selectedActionType, setSelectedActionType] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { data: teamMembers = [] } = useTeamMemberOptions();

  const { data: pendingActions, isLoading } = usePendingActions(
    selectedTeamMember,
    selectedActionType,
    selectedDate
  );

  const actionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'action', label: 'Action' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Team Members</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedActionType} onValueChange={setSelectedActionType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            {actionTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DatePicker
          selected={selectedDate}
          onSelect={setSelectedDate}
          placeholderText="Filter by date"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <PendingActionsList 
            actions={pendingActions || []}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingActionsTab;