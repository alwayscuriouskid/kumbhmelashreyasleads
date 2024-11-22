import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity } from "@/types/leads";

interface TeamActivityRowProps {
  activity: Activity;
  visibleColumns: Record<string, boolean>;
}

const TeamActivityRow = ({ activity, visibleColumns }: TeamActivityRowProps) => {
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-500",
      approved: "bg-green-500/20 text-green-500",
      rejected: "bg-red-500/20 text-red-500",
      followup: "bg-blue-500/20 text-blue-500"
    };
    return colors[status] || "bg-gray-500/20 text-gray-500";
  };

  return (
    <TableRow>
      {visibleColumns.time && <TableCell>{activity.time}</TableCell>}
      {visibleColumns.type && 
        <TableCell className="capitalize">{activity.type.replace('_', ' ')}</TableCell>
      }
      {visibleColumns.description && <TableCell>{activity.description}</TableCell>}
      {visibleColumns.teamMember && 
        <TableCell className="capitalize">{activity.teamMember}</TableCell>
      }
      {visibleColumns.leadName && <TableCell>{activity.leadName}</TableCell>}
      {visibleColumns.statusChange && (
        <TableCell>
          {activity.statusChange && (
            <div className="flex items-center gap-2">
              <Badge className={getStatusBadge(activity.statusChange.from)}>
                {activity.statusChange.from}
              </Badge>
              →
              <Badge className={getStatusBadge(activity.statusChange.to)}>
                {activity.statusChange.to}
              </Badge>
            </div>
          )}
        </TableCell>
      )}
      {visibleColumns.nextFollowUp && 
        <TableCell>{activity.nextFollowUp || "-"}</TableCell>
      }
      {visibleColumns.followUpOutcome && 
        <TableCell>{activity.followUpOutcome || "-"}</TableCell>
      }
      {visibleColumns.nextAction && 
        <TableCell>{activity.nextAction || "-"}</TableCell>
      }
      {visibleColumns.activityOutcome && 
        <TableCell>{activity.activityOutcome || "-"}</TableCell>
      }
    </TableRow>
  );
};

export default TeamActivityRow;