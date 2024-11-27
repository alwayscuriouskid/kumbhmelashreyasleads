import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Activity } from "@/types/leads";
import { format } from "date-fns";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface TeamActivityRowProps {
  activity: Activity;
  visibleColumns: Record<string, boolean>;
}

const TeamActivityRow = ({ activity, visibleColumns }: TeamActivityRowProps) => {
  const { data: teamMembers = [] } = useTeamMemberOptions();
  const [updateText, setUpdateText] = useState(activity.update || "");
  const [isEditing, setIsEditing] = useState(false);
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
      console.error("Error formatting date:", error, "Date string:", dateString);
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
        description: "Activity update saved successfully",
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
    <TableRow className="group">
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
            <div className="flex flex-col gap-2">
              <Input
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                placeholder="Add update..."
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleUpdateSave}
                  className="w-20"
                >
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                  className="w-20"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="group-hover:bg-accent p-2 rounded-md cursor-pointer min-h-[40px]"
              onClick={() => setIsEditing(true)}
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