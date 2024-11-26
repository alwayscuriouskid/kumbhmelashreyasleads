import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { useState } from "react";

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
  const [visibleActions, setVisibleActions] = useState<string[]>(
    actions.map(action => action.id)
  );
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unassigned';
  };

  const handleDelete = (actionId: string) => {
    console.log('Removing action from UI:', actionId);
    setVisibleActions(prev => prev.filter(id => id !== actionId));
  };

  if (isLoading) {
    return <div>Loading pending actions...</div>;
  }

  const visibleActionsList = actions.filter(action => 
    visibleActions.includes(action.id)
  );

  return (
    <div className="space-y-4">
      {visibleActionsList?.length === 0 ? (
        <p className="text-muted-foreground">No pending actions found</p>
      ) : (
        visibleActionsList?.map((action) => (
          <div
            key={action.id}
            className="flex items-start space-x-4 p-4 rounded-lg border animate-fade-in"
          >
            <Checkbox id={action.id} />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{action.description}</p>
                  <Badge variant={action.type === 'follow_up' ? 'default' : 'secondary'}>
                    {action.type === 'follow_up' ? 'Follow Up' : 'Action'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(action.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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