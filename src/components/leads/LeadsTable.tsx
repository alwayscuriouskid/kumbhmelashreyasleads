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
    <div className="table-container rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px] sticky left-0 bg-background"></TableHead>
            {visibleColumns.date && <TableHead className="min-w-[100px]">Date</TableHead>}
            {visibleColumns.clientName && <TableHead className="min-w-[150px]">Client Name</TableHead>}
            {visibleColumns.location && <TableHead className="min-w-[150px]">Location</TableHead>}
            {visibleColumns.contactPerson && <TableHead className="min-w-[150px]">Contact Person</TableHead>}
            {visibleColumns.phone && <TableHead className="min-w-[130px]">Phone</TableHead>}
            {visibleColumns.email && <TableHead className="min-w-[200px]">Email</TableHead>}
            {visibleColumns.requirements && <TableHead className="min-w-[200px]">Requirements</TableHead>}
            {visibleColumns.status && <TableHead className="min-w-[120px]">Status</TableHead>}
            {visibleColumns.remarks && <TableHead className="min-w-[200px]">Remarks</TableHead>}
            {visibleColumns.nextFollowUp && <TableHead className="min-w-[130px]">Next Follow Up</TableHead>}
            {visibleColumns.budget && <TableHead className="min-w-[120px]">Budget</TableHead>}
            {visibleColumns.leadRef && <TableHead className="min-w-[120px]">Lead Reference</TableHead>}
            {visibleColumns.leadSource && <TableHead className="min-w-[120px]">Lead Source</TableHead>}
            <TableHead className="w-[100px] sticky right-0 bg-background">Actions</TableHead>
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