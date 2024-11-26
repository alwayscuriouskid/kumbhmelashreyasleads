import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, X } from "lucide-react";
import { format } from "date-fns";

interface PendingAction {
  id: string;
  type: string;
  description: string;
  dueDate: string;
  clientName: string;
  teamMember: string;
  outcome?: string;
  notes?: string;
  hidden_by?: string[];
}

interface PendingActionCardProps {
  action: PendingAction;
  onHide: () => void;
}

export const PendingActionCard = ({ action, onHide }: PendingActionCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {action.clientName} - {action.type}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onHide}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">{action.description}</p>
          {action.dueDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {format(new Date(action.dueDate), 'PPP')}
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            Assigned to: {action.teamMember}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};