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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg">
        <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Team member" />
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
            <SelectValue placeholder="Action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="call">Calls</SelectItem>
            <SelectItem value="meeting">Meetings</SelectItem>
            <SelectItem value="email">Emails</SelectItem>
            <SelectItem value="follow_up">Follow-ups</SelectItem>
          </SelectContent>
        </Select>

        <DatePicker
          selected={selectedDate}
          onSelect={setSelectedDate}
          placeholderText="Due date"
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