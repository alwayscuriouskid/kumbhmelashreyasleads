import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, EyeOff } from "lucide-react";
import { format } from "date-fns";

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

interface PendingActionCardProps {
  action: PendingAction;
  onComplete: () => void;
  onHide: () => void;
}

export const PendingActionCard = ({ action, onComplete, onHide }: PendingActionCardProps) => {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border animate-fade-in">
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
              onClick={onHide}
              className="h-8 text-muted-foreground hover:text-red-600"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onComplete}
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
          Assigned to: {action.teamMember}
        </p>
        {action.dueDate && (
          <p className="text-sm text-muted-foreground">
            Due: {format(new Date(action.dueDate), 'PPP')}
          </p>
        )}
      </div>
    </div>
  );
};