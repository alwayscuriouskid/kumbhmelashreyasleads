import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteConfirmDialog } from "@/components/inventory/DeleteConfirmDialog";
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

const PendingActionsList = ({ actions: initialActions, isLoading }: PendingActionsListProps) => {
  const { data: teamMembers = [] } = useTeamMemberOptions();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<string | null>(null);
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unassigned';
  };

  const handleDeleteClick = (actionId: string) => {
    setActionToDelete(actionId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!actionToDelete) return;

    try {
      console.log('Deleting action:', actionToDelete);
      
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', actionToDelete);

      if (error) throw error;

      // Immediately invalidate the pending-actions query to trigger a refetch
      await queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
      console.log('Query cache invalidated after deletion');

      toast({
        title: "Action deleted",
        description: "The action has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting action:', error);
      toast({
        title: "Error",
        description: "Failed to delete the action",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setActionToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Loading pending actions...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {initialActions?.length === 0 ? (
          <p className="text-muted-foreground">No pending actions found</p>
        ) : (
          initialActions?.map((action) => (
            <div
              key={action.id}
              className="flex items-start space-x-4 p-4 rounded-lg border animate-fade-in"
            >
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
                    onClick={() => handleDeleteClick(action.id)}
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

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Action"
        description="Are you sure you want to delete this action? This cannot be undone."
      />
    </>
  );
};

export default PendingActionsList;