import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamMember } from "@/types/team";

interface PendingAction {
  id: string;
  type: string;
  description: string;
  dueDate: string;
  clientName: string;
  teamMember: string;
  teamMemberId: string;
}

const PendingActionsSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    ))}
  </div>
);

const PendingActionsTab = () => {
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>("all");
  const [selectedActionType, setSelectedActionType] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { data: teamMembers = [] } = useTeamMemberOptions();

  const { data: pendingActions, isLoading } = useQuery({
    queryKey: ['pending-actions', selectedTeamMember, selectedActionType, selectedDate],
    queryFn: async () => {
      console.log("Fetching pending actions with filters:", {
        teamMember: selectedTeamMember,
        actionType: selectedActionType,
        date: selectedDate
      });

      const { data: leads, error } = await supabase
        .from('leads')
        .select(`
          id,
          client_name,
          next_action,
          next_follow_up,
          team_member_id
        `)
        .not('next_action', 'is', null);

      if (error) {
        console.error("Error fetching pending actions:", error);
        throw error;
      }

      const { data: teamMembersData, error: teamMembersError } = await supabase
        .from('team_members')
        .select('id, name');

      if (teamMembersError) {
        console.error("Error fetching team members:", teamMembersError);
        throw teamMembersError;
      }

      const teamMemberMap = new Map(teamMembersData.map(tm => [tm.id, tm.name]));

      let filteredActions = leads.map(lead => ({
        id: lead.id,
        type: lead.next_action?.toLowerCase().includes('follow') ? 'follow_up' : 'action',
        description: lead.next_action,
        dueDate: lead.next_follow_up,
        clientName: lead.client_name,
        teamMember: teamMemberMap.get(lead.team_member_id) || 'Unassigned',
        teamMemberId: lead.team_member_id || ''
      }));

      if (selectedTeamMember !== 'all') {
        filteredActions = filteredActions.filter(action => action.teamMemberId === selectedTeamMember);
      }

      if (selectedActionType !== 'all') {
        filteredActions = filteredActions.filter(action => action.type === selectedActionType);
      }

      if (selectedDate) {
        filteredActions = filteredActions.filter(action => {
          const actionDate = new Date(action.dueDate);
          return actionDate.toDateString() === selectedDate.toDateString();
        });
      }

      return filteredActions;
    }
  });

  const actionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'action', label: 'Action' }
  ];

  if (isLoading) {
    return <div>Loading pending actions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Team Members</SelectItem>
            {teamMembers.map((member: TeamMember) => (
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
          {isLoading ? (
            <PendingActionsSkeleton />
          ) : pendingActions?.length === 0 ? (
            <p className="text-muted-foreground">No pending actions found</p>
          ) : (
            <div className="space-y-4">
              {pendingActions?.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border animate-fade-in"
                >
                  <Checkbox id={action.id} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{action.description}</p>
                      <Badge variant={action.type === 'follow_up' ? 'default' : 'secondary'}>
                        {action.type === 'follow_up' ? 'Follow Up' : 'Action'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Client: {action.clientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Assigned to: {action.teamMember}
                    </p>
                    {action.dueDate && (
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(action.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingActionsTab;
