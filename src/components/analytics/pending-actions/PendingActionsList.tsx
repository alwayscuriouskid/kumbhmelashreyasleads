import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
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
  const currentTeamMemberId = teamMembers[0]?.id;

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
      // Optimistically update UI
      queryClient.setQueryData(['pending-actions'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.filter((action: PendingAction) => action.id !== actionId);
      });

      const { error: updateError } = await supabase
        .from('activities')
        .update({ 
          hidden_by: [currentTeamMemberId]
        })
        .eq('id', actionId);

      if (updateError) throw updateError;

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
      // Refresh data in case of error
      await queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
    }
  };

  if (isLoading) {
    return <div>Loading pending actions...</div>;
  }

  return (
    <div className="space-y-4">
      {initialActions.length === 0 ? (
        <p className="text-muted-foreground">No pending actions found</p>
      ) : (
        initialActions.map((action) => (
          <PendingActionCard
            key={action.id}
            action={action}
            onHide={() => handleHideAction(action.id)}
          />
        ))
      )}
    </div>
  );
};

export default PendingActionsList;