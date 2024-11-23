import { TableCell } from "@/components/ui/table";
import { Lead } from "@/types/leads";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ShoppingCart, Calendar } from "lucide-react";

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
  const defaultStatuses = ["suspect", "prospect", "analysis", "negotiation", "conclusion", "ongoing_order"];
  const allStatuses = [...defaultStatuses, ...customStatuses];

  const formatStatusLabel = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      suspect: "bg-gray-500/20 text-gray-500",
      prospect: "bg-blue-500/20 text-blue-500",
      analysis: "bg-yellow-500/20 text-yellow-500",
      negotiation: "bg-purple-500/20 text-purple-500",
      conclusion: "bg-green-500/20 text-green-500",
      ongoing_order: "bg-indigo-500/20 text-indigo-500",
      converted: "bg-emerald-500/20 text-emerald-500"
    };
    return colors[status] || "bg-blue-500/20 text-blue-500";
  };

  const getConversionBadge = () => {
    if (!lead.conversion_status) return null;

    const icon = lead.conversion_type === 'order' ? <ShoppingCart className="w-3 h-3 mr-1" /> : <Calendar className="w-3 h-3 mr-1" />;
    
    return (
      <div className="mt-1">
        <Badge variant="outline" className="flex items-center gap-1 text-xs">
          {icon}
          Converted to {lead.conversion_type}
          {lead.conversion_date && (
            <span className="ml-1 text-muted-foreground">
              ({format(new Date(lead.conversion_date), 'dd MMM yyyy')})
            </span>
          )}
        </Badge>
      </div>
    );
  };

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
            {allStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {formatStatusLabel(status)}
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
            <div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lead.status)}`}>
                {formatStatusLabel(lead.status)}
              </span>
              {getConversionBadge()}
            </div>
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
      {visibleColumns.leadRef && (
        <TableCell>{renderCell("leadRef", lead.leadRef || "-")}</TableCell>
      )}
      {visibleColumns.leadSource && (
        <TableCell>{renderCell("leadSource", lead.leadSource || "-")}</TableCell>
      )}
      {visibleColumns.priceQuoted && (
        <TableCell>{renderCell("priceQuoted", lead.priceQuoted?.toString() || "-")}</TableCell>
      )}
      {visibleColumns.nextAction && (
        <TableCell>{renderCell("nextAction", lead.nextAction || "-")}</TableCell>
      )}
      {visibleColumns.followUpOutcome && (
        <TableCell>{renderCell("followUpOutcome", lead.followUpOutcome || "-")}</TableCell>
      )}
    </>
  );
};

export default LeadRowContent;