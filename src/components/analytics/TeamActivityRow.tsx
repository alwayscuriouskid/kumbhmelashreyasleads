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
  const [isDone, setIsDone] = useState(activity.is_completed || false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Activity update changed:', activity.update);
    console.log('Activity completion status:', activity.is_completed);
    if (activity.update !== updateText) {
      setUpdateText(activity.update || "");
    }
    setIsDone(activity.is_completed || false);
  }, [activity.update, activity.is_completed]);

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
        .select()
        .single();

      if (error) throw error;

      console.log('Update saved successfully:', data);
      setUpdateText(data.update || "");
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

  const handleMarkDone = async () => {
    try {
      const newDoneState = !isDone;
      console.log('Marking activity as done:', activity.id, newDoneState);
      
      const { data, error } = await supabase
        .from('activities')
        .update({ 
          is_completed: newDoneState,
          updated_at: new Date().toISOString()
        })
        .eq('id', activity.id)
        .select()
        .single();

      if (error) throw error;

      console.log('Done status updated successfully:', data);
      setIsDone(newDoneState);
      
      toast({
        title: "Success",
        description: newDoneState ? "Activity marked as done" : "Activity marked as not done",
      });
    } catch (error) {
      console.error("Error updating done status:", error);
      toast({
        title: "Error",
        description: "Failed to update activity status",
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
            isDone={isDone}
            onMarkDone={handleMarkDone}
          />
        </TableCell>
      }
    </TableRow>
  );
};

export default TeamActivityRow;