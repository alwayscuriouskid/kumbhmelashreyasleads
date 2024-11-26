import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TeamActivityTableHeaderProps {
  visibleColumns: Record<string, boolean>;
}

const TeamActivityTableHeader = ({ visibleColumns }: TeamActivityTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        {visibleColumns.time && <TableHead>Time</TableHead>}
        {visibleColumns.type && <TableHead>Type</TableHead>}
        {visibleColumns.notes && <TableHead>Notes</TableHead>}
        {visibleColumns.teamMember && <TableHead>Team Member</TableHead>}
        {visibleColumns.leadName && <TableHead>Lead</TableHead>}
        {visibleColumns.activityOutcome && <TableHead>Activity Outcome</TableHead>}
        {visibleColumns.activityNextAction && <TableHead>Next Action</TableHead>}
        {visibleColumns.activityNextActionDate && <TableHead>Next Action Date</TableHead>}
        {visibleColumns.update && <TableHead>Update</TableHead>}
        <TableHead className="sticky right-0 bg-background/80 backdrop-blur-sm">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TeamActivityTableHeader;