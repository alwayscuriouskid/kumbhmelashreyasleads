import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  const handleCompleteClick = (actionId: string) => {
    setActionToComplete(actionId);
    setCompleteDialogOpen(true);
  };

  const handleConfirmComplete = async () => {
    if (!actionToComplete) return;

    try {
      const { error } = await supabase
        .from('activities')
        .update({ is_completed: true })
        .eq('id', actionToComplete);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['pending-actions'] });

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
      // First update the local state through query invalidation
      queryClient.setQueryData(['pending-actions'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((action: PendingAction) => {
          if (action.id === actionId) {
            return {
              ...action,
              hidden_by: [...(action.hidden_by || []), currentTeamMemberId]
            };
          }
          return action;
        });
      });

      // Get current hidden_by array
      const { data: currentAction, error: fetchError } = await supabase
        .from('activities')
        .select('hidden_by')
        .eq('id', actionId)
        .single();

      if (fetchError) throw fetchError;

      // Update with new array
      const updatedHiddenBy = [...(currentAction?.hidden_by || [])];
      if (!updatedHiddenBy.includes(currentTeamMemberId)) {
        updatedHiddenBy.push(currentTeamMemberId);
      }

      // Then update the database
      const { error: updateError } = await supabase
        .from('activities')
        .update({ hidden_by: updatedHiddenBy })
        .eq('id', actionId);

      if (updateError) throw updateError;

      // Invalidate the query to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
      
      toast({
        title: "Action hidden",
        description: "The action has been hidden from your view",
      });
    } catch (error) {
      console.error('Error hiding action:', error);
      toast({
        title: "Error",
        description: "Failed to hide the action",
        variant: "destructive",
      });
      // Invalidate query to revert optimistic update
      await queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
    }
  };

  if (isLoading) {
    return <div>Loading pending actions...</div>;
  }

  const visibleActions = initialActions.filter(action => {
    const isHidden = Array.isArray(action.hidden_by) && action.hidden_by.includes(currentTeamMemberId);
    return !isHidden;
  });

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