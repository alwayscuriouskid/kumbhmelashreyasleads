import { useState } from "react";
import { Lead } from "@/types/leads";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import LeadRowContent from "./LeadRowContent";
import LeadRowExpanded from "./LeadRowExpanded";
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

  return (
    <>
      <TableRow className="group hover:bg-muted/50">
        <TableCell className="w-[40px] sticky left-0 z-20 bg-background">
          <div className="space-y-1">
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
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 w-8 p-0">
                <LeadRowActions onEdit={handleEdit} />
              </Button>
            ) : (
              <div className="space-y-1">
                <Button variant="ghost" size="sm" onClick={handleSave} className="h-8 w-8 p-0">
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </TableCell>
        
        <LeadRowContent 
          lead={lead}
          visibleColumns={visibleColumns}
          isEditing={isEditing}
          editedLead={editedLead}
          handleInputChange={handleInputChange}
          customStatuses={customStatuses}
        />
      </TableRow>
      
      {isExpanded && (
        <LeadRowExpanded 
          lead={editedLead}
          visibleColumns={visibleColumns}
          onFollowUpSubmit={handleFollowUpSubmit}
        />
      )}
    </>
  );
};

export default LeadRow;