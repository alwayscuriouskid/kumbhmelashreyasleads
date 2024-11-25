import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Add this import
import { Trash2 } from "lucide-react"; // Add this import
import { format } from "date-fns";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  onActionDeleted?: () => void;
}

const PendingActionsList = ({ actions, isLoading, onActionDeleted }: PendingActionsListProps) => {
  const { data: teamMembers = [] } = useTeamMemberOptions();
  const { toast } = useToast();
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unassigned';
  };

  const handleDeleteAction = async (actionId: string) => {
    try {
      console.log('Deleting pending action:', actionId);
      
      const { error } = await supabase
        .from('activities')
        .update({
          next_action: null,
          next_action_date: null
        })
        .eq('id', actionId)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pending action marked as completed",
      });

      if (onActionDeleted) {
        onActionDeleted();
      }
    } catch (error) {
      console.error('Error deleting pending action:', error);
      toast({
        title: "Error",
        description: "Failed to delete pending action",
        variant: "destructive",
      });
    }
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
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{action.description}</p>
                  <Badge variant={action.type === 'follow_up' ? 'default' : 'secondary'}>
                    {action.type === 'follow_up' ? 'Follow Up' : 'Action'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteAction(action.id)}
                  className="h-8 w-8"
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