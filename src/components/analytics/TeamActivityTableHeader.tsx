import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TeamActivityTableHeaderProps {
  visibleColumns: Record<string, boolean>;
}

const TeamActivityTableHeader = ({ visibleColumns }: TeamActivityTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        {visibleColumns.date && <TableHead>Date</TableHead>}
        {visibleColumns.time && <TableHead>Time</TableHead>}
        {visibleColumns.type && <TableHead>Type</TableHead>}
        {visibleColumns.notes && <TableHead>Notes</TableHead>}
        {visibleColumns.teamMember && <TableHead>Team Member</TableHead>}
        {visibleColumns.leadName && <TableHead>Lead</TableHead>}
        {visibleColumns.activityOutcome && <TableHead>Activity Outcome</TableHead>}
        {visibleColumns.activityNextAction && <TableHead>Next Action</TableHead>}
        {visibleColumns.activityNextActionDate && <TableHead>Next Action Date</TableHead>}
      </TableRow>
    </TableHeader>
  );
};

export default TeamActivityTableHeader;