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
import { useState, useEffect } from "react";

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
}

interface PendingActionsListProps {
  actions: PendingAction[];
  isLoading: boolean;
}

const HIDDEN_ACTIONS_KEY = 'hiddenPendingActions';

const PendingActionsList = ({ actions: initialActions, isLoading }: PendingActionsListProps) => {
  const { data: teamMembers = [] } = useTeamMemberOptions();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [actionToComplete, setActionToComplete] = useState<string | null>(null);
  const [hiddenActions, setHiddenActions] = useState<Set<string>>(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem(HIDDEN_ACTIONS_KEY);
    return new Set(saved ? JSON.parse(saved) : []);
  });
  
  // Save to localStorage whenever hiddenActions changes
  useEffect(() => {
    localStorage.setItem(HIDDEN_ACTIONS_KEY, JSON.stringify([...hiddenActions]));
  }, [hiddenActions]);
  
  const actions = initialActions.filter(action => !hiddenActions.has(action.id));
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unassigned';
  };

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

      // Hide the action from UI immediately
      setHiddenActions(prev => new Set([...prev, actionToComplete]));

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

  const handleHideAction = (actionId: string) => {
    setHiddenActions(prev => new Set([...prev, actionId]));
    toast({
      title: "Action hidden",
      description: "The action has been hidden from view",
    });
  };

  if (isLoading) {
    return <div>Loading pending actions...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {actions.length === 0 ? (
          <p className="text-muted-foreground">No pending actions found</p>
        ) : (
          actions.map((action) => (
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHideAction(action.id)}
                      className="h-8 text-muted-foreground hover:text-red-600"
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompleteClick(action.id)}
                      className="h-8 text-muted-foreground hover:text-green-600 flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Mark Complete</span>
                    </Button>
                  </div>
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