import { TableCell, TableRow } from "@/components/ui/table";
import { Activity } from "@/types/leads";
import { format } from "date-fns";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";

interface TeamActivityRowProps {
  activity: Activity;
  visibleColumns: Record<string, boolean>;
}

const TeamActivityRow = ({ activity, visibleColumns }: TeamActivityRowProps) => {
  const { data: teamMembers = [] } = useTeamMemberOptions();
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    return member ? member.name : 'Unassigned';
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
      {visibleColumns.activityType && 
        <TableCell>{activity.activityType || "-"}</TableCell>
      }
      {visibleColumns.activityOutcome && 
        <TableCell>{activity.activityOutcome || "-"}</TableCell>
      }
      {visibleColumns.activityNextAction && 
        <TableCell>{activity.activityNextAction || "-"}</TableCell>
      }
      {visibleColumns.activityNextActionDate && 
        <TableCell>
          {activity.activityNextActionDate ? 
            format(new Date(activity.activityNextActionDate), 'dd MMM yyyy') : 
            "-"
          }
        </TableCell>
      }
    </TableRow>
  );
};

export default TeamActivityRow;