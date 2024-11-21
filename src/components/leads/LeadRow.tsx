import { useState } from "react";
import { Lead } from "@/types/leads";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import LeadFollowUps from "./LeadFollowUps";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LeadRowActions from "./LeadRowActions";

interface LeadRowProps {
  lead: Lead;
  visibleColumns: Record<string, boolean>;
  onUpdate?: (updatedLead: Lead) => void;
  customStatuses: string[];
}

const LeadRow = ({ lead, visibleColumns, onUpdate, customStatuses }: LeadRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead>(lead);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate?.(editedLead);
    setIsEditing(false);
    toast({
      title: "Lead Updated",
      description: "The lead information has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditedLead(lead);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Lead, value: string) => {
    setEditedLead((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFollowUpSubmit = (newFollowUp: any) => {
    const updatedLead = {
      ...editedLead,
      followUps: [...(editedLead.followUps || []), newFollowUp],
    };
    onUpdate?.(updatedLead);
    setEditedLead(updatedLead);
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
      <TableRow className="group hover:bg-muted/50">
        <TableCell className="w-[50px] sticky left-0 z-20 bg-background">
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

        <TableCell className="sticky right-0 z-20 bg-background">
          {!isEditing ? (
            <LeadRowActions onEdit={handleEdit} />
          ) : (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length + 2}>
            <div className="py-4 animate-fade-in">
              <LeadFollowUps 
                leadId={lead.id} 
                followUps={editedLead.followUps} 
                onFollowUpSubmit={handleFollowUpSubmit}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default LeadRow;