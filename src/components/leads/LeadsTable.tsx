import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table";
import LeadRow from "./LeadRow";
import { Lead } from "@/types/leads";

interface LeadsTableProps {
  leads: Lead[];
  visibleColumns: Record<string, boolean>;
  onUpdateLead: (lead: Lead) => void;
  customStatuses: string[];
}

const LeadsTable = ({ leads, visibleColumns, onUpdateLead, customStatuses }: LeadsTableProps) => {
  return (
    <div className="table-container rounded-md border border-border overflow-x-auto pr-4">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.date && <TableHead>Date</TableHead>}
            {visibleColumns.clientName && <TableHead>Client Name</TableHead>}
            {visibleColumns.location && <TableHead>Location</TableHead>}
            {visibleColumns.contactPerson && <TableHead>Contact Person</TableHead>}
            {visibleColumns.phone && <TableHead>Phone</TableHead>}
            {visibleColumns.email && <TableHead>Email</TableHead>}
            {visibleColumns.requirements && <TableHead className="min-w-[200px]">Requirements</TableHead>}
            {visibleColumns.status && <TableHead>Status</TableHead>}
            {visibleColumns.remarks && <TableHead className="min-w-[200px]">Remarks</TableHead>}
            {visibleColumns.nextFollowUp && <TableHead>Next Follow Up</TableHead>}
            {visibleColumns.budget && <TableHead>Budget</TableHead>}
            {visibleColumns.leadRef && <TableHead>Lead Reference</TableHead>}
            {visibleColumns.leadSource && <TableHead>Lead Source</TableHead>}
            {visibleColumns.priceQuoted && <TableHead>Price Quoted</TableHead>}
            {visibleColumns.nextAction && <TableHead>Next Action</TableHead>}
            {visibleColumns.followUpOutcome && <TableHead>Follow Up Outcome</TableHead>}
            <TableHead className="w-[60px] sticky right-4 bg-background z-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <LeadRow 
              key={lead.id} 
              lead={lead} 
              visibleColumns={visibleColumns}
              onUpdate={onUpdateLead}
              customStatuses={customStatuses}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsTable;