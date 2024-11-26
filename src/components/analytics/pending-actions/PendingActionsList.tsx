import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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

const PendingActionsList = ({ actions: initialActions, isLoading }: PendingActionsListProps) => {
  const { data: teamMembers = [] } = useTeamMemberOptions();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unassigned';
  };

  const handleDelete = async (actionId: string) => {
    try {
      console.log('Marking action as completed:', actionId);
      
      const { error } = await supabase
        .from('activities')
        .update({ is_completed: true })
        .eq('id', actionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['pending-actions'] });

      toast({
        title: "Action completed",
        description: "The action has been marked as completed",
      });
    } catch (error) {
      console.error('Error completing action:', error);
      toast({
        title: "Error",
        description: "Failed to complete the action",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading pending actions...</div>;
  }

  return (
    <div className="space-y-4">
      {initialActions?.length === 0 ? (
        <p className="text-muted-foreground">No pending actions found</p>
      ) : (
        initialActions?.map((action) => (
          <div
            key={action.id}
            className="flex items-start space-x-4 p-4 rounded-lg border animate-fade-in"
          >
            <Checkbox 
              id={action.id}
              onCheckedChange={() => handleDelete(action.id)}
            />
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