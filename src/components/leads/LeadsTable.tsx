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
    <div className="table-container">
      <Table>
        <TableHeader className="sticky left-0">
          <TableRow>
            <TableHead className="w-[50px] bg-background"></TableHead>
            {visibleColumns.date && <TableHead>Date</TableHead>}
            {visibleColumns.clientName && <TableHead>Client Name</TableHead>}
            {visibleColumns.location && <TableHead>Location</TableHead>}
            {visibleColumns.contactPerson && <TableHead>Contact Person</TableHead>}
            {visibleColumns.phone && <TableHead>Phone</TableHead>}
            {visibleColumns.email && <TableHead>Email</TableHead>}
            {visibleColumns.requirements && <TableHead>Requirements</TableHead>}
            {visibleColumns.status && <TableHead>Status</TableHead>}
            {visibleColumns.remarks && <TableHead>Remarks</TableHead>}
            {visibleColumns.nextFollowUp && <TableHead>Next Follow Up</TableHead>}
            {visibleColumns.budget && <TableHead>Budget</TableHead>}
            <TableHead className="sticky right-0 bg-background">Actions</TableHead>
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