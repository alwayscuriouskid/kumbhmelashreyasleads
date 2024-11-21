import { useState } from "react";
import { Lead } from "@/types/leads";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import LeadFollowUps from "./LeadFollowUps";

interface LeadRowProps {
  lead: Lead;
  visibleColumns: Record<string, boolean>;
}

const LeadRow = ({ lead, visibleColumns }: LeadRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow className="group">
        <TableCell className="w-[50px]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        {visibleColumns.date && <TableCell>{lead.date}</TableCell>}
        {visibleColumns.clientName && (
          <TableCell className="font-medium">{lead.clientName}</TableCell>
        )}
        {visibleColumns.location && <TableCell>{lead.location}</TableCell>}
        {visibleColumns.contactPerson && (
          <TableCell>{lead.contactPerson}</TableCell>
        )}
        {visibleColumns.phone && <TableCell>{lead.phone}</TableCell>}
        {visibleColumns.email && <TableCell>{lead.email}</TableCell>}
        {visibleColumns.requirements && (
          <TableCell>
            <div className="space-y-1">
              {lead.requirement.hoardings && (
                <div>Hoardings: {lead.requirement.hoardings}</div>
              )}
              {lead.requirement.entryGates && (
                <div>Entry Gates: {lead.requirement.entryGates}</div>
              )}
              {lead.requirement.electricPoles && (
                <div>Electric Poles: {lead.requirement.electricPoles}</div>
              )}
              {lead.requirement.watchTowers && (
                <div>Watch Towers: {lead.requirement.watchTowers}</div>
              )}
              {lead.requirement.chargingPoints && (
                <div>Charging Points: {lead.requirement.chargingPoints}</div>
              )}
              {lead.requirement.skyBalloons && (
                <div>Sky Balloons: {lead.requirement.skyBalloons}</div>
              )}
            </div>
          </TableCell>
        )}
        {visibleColumns.status && (
          <TableCell>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                lead.status === "approved"
                  ? "bg-green-500/20 text-green-500"
                  : lead.status === "rejected"
                  ? "bg-red-500/20 text-red-500"
                  : lead.status === "followup"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-blue-500/20 text-blue-500"
              }`}
            >
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </span>
          </TableCell>
        )}
        {visibleColumns.remarks && <TableCell>{lead.remarks}</TableCell>}
        {visibleColumns.nextFollowUp && (
          <TableCell>{lead.nextFollowUp || "-"}</TableCell>
        )}
        {visibleColumns.budget && <TableCell>{lead.budget || "-"}</TableCell>}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length + 1}>
            <div className="py-4 animate-fade-in">
              <LeadFollowUps leadId={lead.id} followUps={lead.followUps} />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default LeadRow;