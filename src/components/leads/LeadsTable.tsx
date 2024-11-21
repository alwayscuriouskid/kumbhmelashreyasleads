import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="border rounded-lg bg-background/50">
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
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
                <TableHead>Actions</TableHead>
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
      </div>
    </div>
  );
};

export default LeadsTable;