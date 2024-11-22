import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const dummyNotifications = [
  {
    id: "followup-1",
    type: "follow_up",
    dueDate: new Date().toISOString().split('T')[0],
    clientName: "ABC Corp",
    description: "Follow up with ABC Corp regarding event proposal"
  },
  {
    id: "action-2",
    type: "next_action",
    dueDate: new Date().toISOString().split('T')[0],
    clientName: "XYZ Ltd",
    description: "Send revised quotation for LED hoardings"
  },
  {
    id: "followup-3",
    type: "follow_up",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientName: "Tech Solutions",
    description: "Schedule demo meeting for web series production"
  },
  {
    id: "action-4",
    type: "next_action",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientName: "Global Events",
    description: "Prepare detailed proposal for activation zones"
  }
];

const LeadActionNotifications = () => {
  const { toast } = useToast();
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const handleActionComplete = async (notificationId: string) => {
    console.log("Marking action as complete:", notificationId);
    
    setCompletedActions(prev => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      return newSet;
    });

    toast({
      title: "Action completed",
      description: "The action has been marked as completed",
    });
  };

  const activeNotifications = dummyNotifications.filter(
    notification => !completedActions.has(notification.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {activeNotifications.length === 0 ? (
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
                    Due: {new Date(notification.dueDate).toLocaleDateString()}
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