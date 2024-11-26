import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteConfirmDialog } from "@/components/inventory/DeleteConfirmDialog";
import { useState } from "react";
import { PendingActionCard } from "./PendingActionCard";

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
  is_completed?: boolean;
  hidden_by?: string[];
}

interface PendingActionsListProps {
  actions: PendingAction[];
  isLoading: boolean;
}

const PendingActionsList = ({ actions: initialActions, isLoading }: PendingActionsListProps) => {
  const { data: teamMembers = [] } = useTeamMemberOptions();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [actionToComplete, setActionToComplete] = useState<string | null>(null);
  
  const currentTeamMemberId = teamMembers[0]?.id;
  console.log('Current team member ID:', currentTeamMemberId);
  
  const handleCompleteClick = (actionId: string) => {
    setActionToComplete(actionId);
    setCompleteDialogOpen(true);
  };

  const handleConfirmComplete = async () => {
    if (!actionToComplete) return;

    try {
      console.log('Marking activity as completed:', actionToComplete);
      
      const { error } = await supabase
        .from('activities')
        .update({ is_completed: true })
        .eq('id', actionToComplete);

      if (error) throw error;

      console.log('Activity marked as completed successfully');
      await queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
      console.log('Query cache invalidated after completion');

      toast({
        title: "Action completed",
        description: "The action has been marked as completed",
      });
    } catch (error) {
      console.error('Error marking activity as completed:', error);
      toast({
        title: "Error",
        description: "Failed to complete the action",
        variant: "destructive",
      });
    } finally {
      setCompleteDialogOpen(false);
      setActionToComplete(null);
    }
  };

  const handleHideAction = async (actionId: string) => {
    if (!currentTeamMemberId) {
      console.error('No team member ID available');
      toast({
        title: "Error",
        description: "Unable to hide action - no team member ID found",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Hiding action:', actionId, 'for team member:', currentTeamMemberId);
      
      const { data: currentAction, error: fetchError } = await supabase
        .from('activities')
        .select('hidden_by')
        .eq('id', actionId)
        .single();

      if (fetchError) {
        console.error('Error fetching current action:', fetchError);
        throw fetchError;
      }

      console.log('Current action data:', currentAction);
      const currentHiddenBy = currentAction?.hidden_by || [];
      console.log('Current hidden_by array:', currentHiddenBy);

      if (currentHiddenBy.includes(currentTeamMemberId)) {
        console.log('Action already hidden for this team member');
        return;
      }

      const updatedHiddenBy = [...currentHiddenBy, currentTeamMemberId];
      console.log('Updated hidden_by array:', updatedHiddenBy);

      const { error: updateError } = await supabase
        .from('activities')
        .update({ hidden_by: updatedHiddenBy })
        .eq('id', actionId);

      if (updateError) {
        console.error('Error updating hidden_by:', updateError);
        throw updateError;
      }

      console.log('Successfully updated hidden_by array');
      await queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
      
      toast({
        title: "Action hidden",
        description: "The action has been hidden from view",
      });
    } catch (error) {
      console.error('Error hiding action:', error);
      toast({
        title: "Error",
        description: "Failed to hide the action",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading pending actions...</div>;
  }

  // Filter out actions that are hidden by the current team member
  const visibleActions = initialActions.filter(action => {
    console.log('Checking visibility for action:', action.id);
    console.log('Action hidden_by:', action.hidden_by);
    console.log('Current team member ID:', currentTeamMemberId);
    
    const isHidden = action.hidden_by?.includes(currentTeamMemberId);
    console.log('Is action hidden?', isHidden);
    
    return !isHidden;
  });

  console.log('Visible actions count:', visibleActions.length);

  return (
    <>
      <div className="space-y-4">
        {visibleActions.length === 0 ? (
          <p className="text-muted-foreground">No pending actions found</p>
        ) : (
          visibleActions.map((action) => (
            <PendingActionCard
              key={action.id}
              action={action}
              onComplete={() => handleCompleteClick(action.id)}
              onHide={() => handleHideAction(action.id)}
            />
          ))
        )}
      </div>

      <DeleteConfirmDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        onConfirm={handleConfirmComplete}
        title="Complete Action"
        description="Are you sure you want to mark this action as completed? This will remove it from the pending actions list."
      />
    </>
  );
};

export default PendingActionsList;