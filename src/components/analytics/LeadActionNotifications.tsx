import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ActionNotification {
  id: string;
  type: 'follow_up' | 'next_action';
  dueDate: string;
  clientName: string;
  description: string;
  completed?: boolean;
}

const LeadActionNotifications = () => {
  const { toast } = useToast();
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['lead-notifications'],
    queryFn: async () => {
      console.log("Fetching lead notifications");
      const today = new Date().toISOString().split('T')[0];
      
      const { data: followUps, error: followUpsError } = await supabase
        .from('leads')
        .select('id, client_name, next_follow_up, next_action, follow_up_outcome')
        .or(`next_follow_up.gte.${today},and(next_action.neq.null,follow_up_outcome.is.null)`);

      if (followUpsError) {
        console.error("Error fetching notifications:", followUpsError);
        throw followUpsError;
      }

      const actionNotifications: ActionNotification[] = [];
      
      followUps?.forEach(lead => {
        if (lead.next_follow_up) {
          actionNotifications.push({
            id: `followup-${lead.id}`,
            type: 'follow_up',
            dueDate: lead.next_follow_up,
            clientName: lead.client_name,
            description: `Follow up with ${lead.client_name}`
          });
        }
        
        if (lead.next_action && !lead.follow_up_outcome) {
          actionNotifications.push({
            id: `action-${lead.id}`,
            type: 'next_action',
            dueDate: today,
            clientName: lead.client_name,
            description: lead.next_action
          });
        }
      });

      return actionNotifications.sort((a, b) => 
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    }
  });

  const handleActionComplete = async (notificationId: string) => {
    console.log("Marking action as complete:", notificationId);
    
    setCompletedActions(prev => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      return newSet;
    });

    const [type, leadId] = notificationId.split('-');
    
    try {
      const updates = type === 'followup' 
        ? { next_follow_up: null }
        : { next_action: null };

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Action completed",
        description: "The action has been marked as completed",
      });
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({
        title: "Error",
        description: "Failed to mark action as completed",
        variant: "destructive",
      });
    }
  };

  const activeNotifications = notifications.filter(
    notification => !completedActions.has(notification.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading notifications...</p>
        ) : activeNotifications.length === 0 ? (
          <p className="text-muted-foreground">No pending actions</p>
        ) : (
          <div className="space-y-4">
            {activeNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start space-x-4 p-4 rounded-lg border"
              >
                <Checkbox
                  id={notification.id}
                  onCheckedChange={() => handleActionComplete(notification.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{notification.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Client: {notification.clientName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Due: {format(new Date(notification.dueDate), 'PP')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadActionNotifications;