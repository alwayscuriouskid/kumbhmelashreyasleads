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
        {visibleColumns.description && <TableHead>Description</TableHead>}
        {visibleColumns.teamMember && <TableHead>Team Member</TableHead>}
        {visibleColumns.leadName && <TableHead>Lead</TableHead>}
        {visibleColumns.statusChange && <TableHead>Status Change</TableHead>}
        {visibleColumns.nextFollowUp && <TableHead>Next Follow-up</TableHead>}
        {visibleColumns.followUpOutcome && <TableHead>Follow-up Outcome</TableHead>}
        {visibleColumns.nextAction && <TableHead>Next Action</TableHead>}
        {visibleColumns.activityOutcome && <TableHead>Activity Outcome</TableHead>}
      </TableRow>
    </TableHeader>
  );
};

export default TeamActivityTableHeader;