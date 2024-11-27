import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (activity.update !== updateText) {
      setUpdateText(activity.update || "");
    }
  }, [activity.update]);

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
      console.log('Saving update:', value, 'for activity:', activity.id);
      
      const { data, error } = await supabase
        .from('activities')
        .update({ update: value })
        .eq('id', activity.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('No activity found with the given ID');
      }

      console.log('Update saved successfully:', data[0]);
      setUpdateText(data[0].update || "");
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Update saved successfully",
      });
    } catch (error) {
      console.error("Error saving update:", error);
      setUpdateText(activity.update || "");
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
            placeholder="Click to add update"
          />
        </TableCell>
      }
    </TableRow>
  );
};

export default TeamActivityRow;