import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Activity } from "@/types/leads";
import { format } from "date-fns";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TeamActivityRowProps {
  activity: Activity;
  visibleColumns: Record<string, boolean>;
}

const TeamActivityRow = ({ activity, visibleColumns }: TeamActivityRowProps) => {
  const { data: teamMembers = [] } = useTeamMemberOptions();
  const [isEditing, setIsEditing] = useState(false);
  const [updateText, setUpdateText] = useState(activity.update || "");
  const { toast } = useToast();
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unassigned';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return "-";
    }
  };

  const handleUpdateSave = async () => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ update: updateText })
        .eq('id', activity.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Update saved successfully",
      });
    } catch (error) {
      console.error("Error saving update:", error);
      toast({
        title: "Error",
        description: "Failed to save update",
        variant: "destructive",
      });
    }
  };

  return (
    <TableRow>
      {visibleColumns.time && <TableCell>{activity.time}</TableCell>}
      {visibleColumns.type && 
        <TableCell className="capitalize">{activity.type.replace('_', ' ')}</TableCell>
      }
      {visibleColumns.notes && <TableCell>{activity.notes}</TableCell>}
      {visibleColumns.teamMember && 
        <TableCell className="capitalize">
          {activity.teamMember ? getTeamMemberName(activity.teamMember) : 'Unassigned'}
        </TableCell>
      }
      {visibleColumns.leadName && <TableCell>{activity.leadName}</TableCell>}
      {visibleColumns.activityOutcome && 
        <TableCell>{activity.outcome || "-"}</TableCell>
      }
      {visibleColumns.activityNextAction && 
        <TableCell>{activity.nextAction || "-"}</TableCell>
      }
      {visibleColumns.activityNextActionDate && 
        <TableCell>{formatDate(activity.next_action_date)}</TableCell>
      }
      {visibleColumns.update && 
        <TableCell>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                placeholder="Add update..."
              />
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleUpdateSave}
                >
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="cursor-pointer min-h-[40px] p-2 hover:bg-accent rounded"
            >
              {activity.update || "Click to add update"}
            </div>
          )}
        </TableCell>
      }
    </TableRow>
  );
};

export default TeamActivityRow;