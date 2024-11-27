import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Activity } from "@/types/leads";
import { format } from "date-fns";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { EditableCell } from "@/components/inventory/EditableCell";
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

  const handleUpdateChange = async (value: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ update: value })
        .eq('id', activity.id);

      if (error) throw error;

      setUpdateText(value);
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
          <EditableCell
            value={updateText}
            isEditing={isEditing}
            onChange={handleUpdateChange}
            onEditToggle={() => setIsEditing(!isEditing)}
          />
        </TableCell>
      }
    </TableRow>
  );
};

export default TeamActivityRow;