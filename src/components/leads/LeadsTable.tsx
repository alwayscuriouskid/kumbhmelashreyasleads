import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import LeadRow from "./LeadRow";
import { Lead } from "@/types/leads";
import { exportToExcel } from "@/utils/exportUtils";
import { toast } from "@/components/ui/use-toast";

interface LeadsTableProps {
  leads: Lead[];
  visibleColumns: Record<string, boolean>;
  onUpdateLead: (lead: Lead) => void;
  customStatuses: string[];
}

const LeadsTable = ({ leads, visibleColumns, onUpdateLead, customStatuses }: LeadsTableProps) => {
  const handleExport = () => {
    try {
      const exportData = leads.map(lead => ({
        Date: lead.date,
        'Client Name': lead.clientName,
        Location: lead.location,
        'Contact Person': lead.contactPerson,
        Phone: lead.phone,
        Email: lead.email,
        Requirements: JSON.stringify(lead.requirement),
        Status: lead.status,
        'Assigned To': lead.teamMemberId || '-', // Added assigned to field
        'Lead Reference': lead.leadRef,
        'Lead Source': lead.leadSource,
        'Price Quoted': lead.priceQuoted,
        'Activity Type': lead.activityType,
        'Activity Outcome': lead.activityOutcome,
        'Next Action': lead.activityNextAction,
        'Next Action Date': lead.activityNextActionDate,
      }));

      exportToExcel(exportData, 'leads-export');
      toast({
        title: "Export Successful",
        description: "The leads data has been exported to Excel",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export leads data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={handleExport}
          className="mb-4"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>
      
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
              {visibleColumns.teamMember && <TableHead>Assigned To</TableHead>} {/* Added team member column */}
              {visibleColumns.leadRef && <TableHead>Lead Reference</TableHead>}
              {visibleColumns.leadSource && <TableHead>Lead Source</TableHead>}
              {visibleColumns.priceQuoted && <TableHead>Price Quoted</TableHead>}
              {visibleColumns.activityType && <TableHead>Activity Type</TableHead>}
              {visibleColumns.activityOutcome && <TableHead>Activity Outcome</TableHead>}
              {visibleColumns.activityNextAction && <TableHead>Next Action</TableHead>}
              {visibleColumns.activityNextActionDate && <TableHead>Next Action Date</TableHead>}
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
    </div>
  );
};

export default LeadsTable;
