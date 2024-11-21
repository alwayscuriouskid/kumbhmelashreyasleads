import { TableCell } from "@/components/ui/table";
import { Lead } from "@/types/leads";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeadRowContentProps {
  lead: Lead;
  visibleColumns: Record<string, boolean>;
  isEditing: boolean;
  editedLead: Lead;
  handleInputChange: (field: keyof Lead, value: string) => void;
  customStatuses: string[];
}

const LeadRowContent = ({ 
  lead, 
  visibleColumns, 
  isEditing, 
  editedLead, 
  handleInputChange,
  customStatuses 
}: LeadRowContentProps) => {
  const renderCell = (field: keyof Lead, content: React.ReactNode) => {
    if (!isEditing) return content;
    
    if (field === "status") {
      return (
        <Select
          value={editedLead.status}
          onValueChange={(value) => handleInputChange("status", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="followup">Follow Up</SelectItem>
            {customStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field === "requirement") return content;

    return (
      <Input
        value={typeof editedLead[field] === 'string' ? editedLead[field] as string : ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full"
      />
    );
  };

  return (
    <>
      {visibleColumns.date && (
        <TableCell>{renderCell("date", lead.date)}</TableCell>
      )}
      {visibleColumns.clientName && (
        <TableCell>{renderCell("clientName", lead.clientName)}</TableCell>
      )}
      {visibleColumns.location && (
        <TableCell>{renderCell("location", lead.location)}</TableCell>
      )}
      {visibleColumns.contactPerson && (
        <TableCell>{renderCell("contactPerson", lead.contactPerson)}</TableCell>
      )}
      {visibleColumns.phone && (
        <TableCell>{renderCell("phone", lead.phone)}</TableCell>
      )}
      {visibleColumns.email && (
        <TableCell>{renderCell("email", lead.email)}</TableCell>
      )}
      {visibleColumns.requirements && (
        <TableCell>
          <div className="space-y-1">
            {Object.entries(lead.requirement).map(([key, value]) => (
              value && (
                <div key={key} className="text-sm">
                  {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                </div>
              )
            ))}
          </div>
        </TableCell>
      )}
      {visibleColumns.status && (
        <TableCell>
          {renderCell("status", 
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
          )}
        </TableCell>
      )}
      {visibleColumns.remarks && (
        <TableCell>{renderCell("remarks", lead.remarks)}</TableCell>
      )}
      {visibleColumns.nextFollowUp && (
        <TableCell>{renderCell("nextFollowUp", lead.nextFollowUp || "-")}</TableCell>
      )}
      {visibleColumns.budget && (
        <TableCell>{renderCell("budget", lead.budget || "-")}</TableCell>
      )}
    </>
  );
};

export default LeadRowContent;