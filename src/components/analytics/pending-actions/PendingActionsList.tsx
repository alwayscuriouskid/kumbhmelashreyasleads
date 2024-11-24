import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";

interface PendingAction {
  id: string;
  type: string;
  description: string;
  dueDate: string;
  clientName: string;
  teamMember: string;
  teamMemberId: string;
  outcome?: string;
  notes?: string;
}

interface PendingActionsListProps {
  actions: PendingAction[];
  isLoading: boolean;
}

const PendingActionsList = ({ actions, isLoading }: PendingActionsListProps) => {
  const { data: teamMembers = [] } = useTeamMemberOptions();
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unassigned';
  };

  if (isLoading) {
    return <div>Loading pending actions...</div>;
  }

  return (
    <div className="space-y-4">
      {actions?.length === 0 ? (
        <p className="text-muted-foreground">No pending actions found</p>
      ) : (
        actions?.map((action) => (
          <div
            key={action.id}
            className="flex items-start space-x-4 p-4 rounded-lg border animate-fade-in"
          >
            <Checkbox id={action.id} />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <p className="font-medium">{action.description}</p>
                <Badge variant={action.type === 'follow_up' ? 'default' : 'secondary'}>
                  {action.type === 'follow_up' ? 'Follow Up' : 'Action'}
                </Badge>
              </div>
              {action.notes && (
                <p className="text-sm text-muted-foreground">
                  Notes: {action.notes}
                </p>
              )}
              {action.outcome && (
                <p className="text-sm text-muted-foreground">
                  Outcome: {action.outcome}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Client: {action.clientName}
              </p>
              <p className="text-sm text-muted-foreground">
                Assigned to: {getTeamMemberName(action.teamMemberId)}
              </p>
              {action.dueDate && (
                <p className="text-sm text-muted-foreground">
                  Due: {format(new Date(action.dueDate), 'PPP')}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingActionsList;