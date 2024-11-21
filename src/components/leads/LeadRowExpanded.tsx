import { TableRow, TableCell } from "@/components/ui/table";
import LeadFollowUps from "./LeadFollowUps";
import { Lead } from "@/types/leads";

interface LeadRowExpandedProps {
  lead: Lead;
  visibleColumns: Record<string, boolean>;
  onFollowUpSubmit: (newFollowUp: any) => void;
}

const LeadRowExpanded = ({ lead, visibleColumns, onFollowUpSubmit }: LeadRowExpandedProps) => {
  return (
    <TableRow>
      <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length + 1}>
        <div className="py-4 animate-fade-in">
          <LeadFollowUps 
            leadId={lead.id} 
            followUps={lead.followUps} 
            onFollowUpSubmit={onFollowUpSubmit}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LeadRowExpanded;